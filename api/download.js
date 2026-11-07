// /api/download.js - Permanent redirector to the latest Canary, Beta, or Stable Release APK
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  // Parse channel from query (?channel=canary | beta | release)
  let channel = (req.query.channel || 'release').toString().toLowerCase().trim();
  if (channel === 'stable') channel = 'release';
  if (channel === 'nightly') channel = 'canary';

  const acceptsJson = req.query.json === 'true' || req.query.json === '1' || 
    (req.headers['accept'] && req.headers['accept'].includes('application/json'));

  // Reliable fallbacks in case GitHub API rate-limits or network fails
  const fallbackUrls = {
    canary: 'https://github.com/MoltenSt4r/MoltenGram/releases/download/canary/MoltenGram-v12.10.6-84efeff.4116.apk',
    beta: 'https://github.com/MoltenSt4r/MoltenGram/releases/download/v12.10.6-beta15/MoltenGram-v12.10.6-beta15-b85079e.3257.apk',
    release: 'https://github.com/MoltenSt4r/MoltenGram/releases/download/v12.10.6/MoltenGram-v12.10.6-b85079e.3257.apk'
  };

  try {
    const ghRes = await fetch('https://api.github.com/repos/MoltenSt4r/MoltenGram/releases?per_page=35', {
      headers: {
        'User-Agent': 'MoltenStar-Site-Download-Resolver/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!ghRes.ok) {
      throw new Error(`GitHub API HTTP ${ghRes.status}`);
    }

    const releases = await ghRes.json();
    let targetApk = null;
    let targetRel = null;

    if (channel === 'canary') {
      const canaryRel = releases.find(r => (r.tag_name || '').toLowerCase() === 'canary');
      if (canaryRel && Array.isArray(canaryRel.assets)) {
        const apks = canaryRel.assets.filter(a => a.name && a.name.endsWith('.apk'));
        apks.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
        targetApk = apks[0];
        targetRel = canaryRel;
      }
    } else if (channel === 'beta') {
      const betaRel = releases.find(r => {
        const tag = (r.tag_name || '').toLowerCase();
        return tag !== 'canary' && (tag.includes('beta') || r.prerelease);
      });
      if (betaRel && Array.isArray(betaRel.assets)) {
        targetApk = betaRel.assets.find(a => a.name && a.name.endsWith('.apk'));
        targetRel = betaRel;
      }
    } else {
      // Default: release / stable
      const stableRel = releases.find(r => {
        const tag = (r.tag_name || '').toLowerCase();
        return tag !== 'canary' && !tag.includes('beta') && !r.prerelease;
      });
      if (stableRel && Array.isArray(stableRel.assets)) {
        targetApk = stableRel.assets.find(a => a.name && a.name.endsWith('.apk'));
        targetRel = stableRel;
      }
    }

    // Safety fallback: any APK in releases
    if (!targetApk || !targetApk.browser_download_url) {
      for (const rel of releases) {
        const apk = (rel.assets || []).find(a => a.name && a.name.endsWith('.apk'));
        if (apk) {
          targetApk = apk;
          targetRel = rel;
          break;
        }
      }
    }

    const downloadUrl = targetApk?.browser_download_url || fallbackUrls[channel] || fallbackUrls.release;

    // Cache on Vercel Edge CDN for 60s, stale-while-revalidate for 5m
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

    if (acceptsJson) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      return res.end(JSON.stringify({
        channel,
        version: targetRel?.tag_name || targetApk?.name || 'latest',
        name: targetApk?.name || 'MoltenGram.apk',
        size: targetApk?.size || 0,
        downloadUrl,
        updated_at: targetApk?.updated_at || new Date().toISOString()
      }, null, 2));
    }

    // 307 Temporary Redirect straight to APK download
    res.writeHead(307, {
      'Location': downloadUrl,
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    });
    return res.end();
  } catch (err) {
    const fallback = fallbackUrls[channel] || fallbackUrls.release;
    if (acceptsJson) {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      return res.end(JSON.stringify({
        channel,
        fallback: true,
        downloadUrl: fallback,
        error: err.message
      }));
    }
    res.writeHead(307, {
      'Location': fallback,
      'Cache-Control': 'no-cache'
    });
    return res.end();
  }
};
