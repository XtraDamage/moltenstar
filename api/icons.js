// /api/icons.js - Auto-discovers launcher icons from XtraDamage/moltenstar and MoltenSt4r/MoltenGram
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  const headers = {
    'User-Agent': 'MoltenStar-Site-Icons/1.0',
    'Accept': 'application/vnd.github.v3+json'
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const ALIAS_MAP = {
    main: 'moltengram',
    classic: 'moltengram',
    burn: 'burning',
    coffe: 'coffee',
    extera: 'exteragram',
    nothingos: 'nothing',
    dotted: 'nothing',
    onix: 'onyx',
    sunrice: 'sunrise',
    glicer2: 'glacier',
    glicer: 'glacier',
    shizo: 'schizophrenia'
  };

  const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg)$/i;
  const merged = new Map();

  function addEntry(file, rawUrl, preferRaw) {
    const rawKey = file
      .toLowerCase()
      .replace(/^ic_launcher_moltengram_?/, '')
      .replace(/icon\d*\.[^.]+$/, '')
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-z0-9]/g, '') || 'moltengram';
    const stemKey = ALIAS_MAP[rawKey] || rawKey;
    if (!merged.has(stemKey)) {
      merged.set(stemKey, { file, rawUrl, preferRaw: Boolean(preferRaw) });
    }
  }

  try {
    const [siteRes, appRes] = await Promise.allSettled([
      fetch('https://api.github.com/repos/XtraDamage/moltenstar/contents/icons/appicons', { headers }),
      fetch('https://api.github.com/repos/MoltenSt4r/MoltenGram/contents/TMessagesProj/src/main/res/mipmap-xxxhdpi?ref=main', { headers })
    ]);

    if (siteRes.status === 'fulfilled' && siteRes.value.ok) {
      const entries = await siteRes.value.json();
      if (Array.isArray(entries)) {
        entries
          .filter(item => item && item.type === 'file' && IMAGE_EXT.test(item.name))
          .forEach(item => addEntry(
            item.name,
            item.download_url || `https://raw.githubusercontent.com/XtraDamage/moltenstar/main/icons/appicons/${encodeURIComponent(item.name)}`,
            false
          ));
      }
    }

    if (appRes.status === 'fulfilled' && appRes.value.ok) {
      const appEntries = await appRes.value.json();
      if (Array.isArray(appEntries)) {
        appEntries
          .filter(item => item && item.type === 'file' && /^ic_launcher_moltengram.*\.png$/i.test(item.name) && !/_round\.png$|_foreground\.png$|_background\.png$/i.test(item.name))
          .forEach(item => {
            const shortName = item.name.replace(/^ic_launcher_moltengram_?/i, '').replace(/\.png$/i, '');
            const displayFile = shortName ? `${shortName}icon.png` : 'mainicon.png';
            addEntry(
              displayFile,
              item.download_url || `https://raw.githubusercontent.com/MoltenSt4r/MoltenGram/main/TMessagesProj/src/main/res/mipmap-xxxhdpi/${encodeURIComponent(item.name)}`,
              true
            );
          });
      }
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ icons: Array.from(merged.values()) }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ icons: [], error: err.message }));
  }
};
