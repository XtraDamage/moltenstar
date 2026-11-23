// /api/releases.js - Edge-cached proxy for MoltenGram GitHub releases (avoids browser 60 req/hr IP rate limit)
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const headers = {
    'User-Agent': 'MoltenStar-Site-Releases/1.0',
    'Accept': 'application/vnd.github.v3+json'
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const repoParam = (req.query.repo || 'android').toString().toLowerCase().trim();
  const repoSlug = repoParam === 'desktop' ? 'MoltenSt4r/MoltenGram-Desktop' : 'MoltenSt4r/MoltenGram';
  const perPage = repoParam === 'desktop' ? 20 : 40;

  try {
    const ghRes = await fetch(`https://api.github.com/repos/${repoSlug}/releases?per_page=${perPage}`, { headers });
    if (!ghRes.ok) {
      res.statusCode = ghRes.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: `GitHub API HTTP ${ghRes.status}` }));
    }

    const releases = await ghRes.json();
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    return res.end(JSON.stringify(releases));
  } catch (err) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: err.message || 'Upstream fetch failed' }));
  }
};
