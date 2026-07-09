// Fetches a Ylopo listing page and extracts structured property data.
// Handles __YLOPO_APP_CONTEXT__ (Palisade/Ylopo search sites) with og: tag fallback.

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { listingUrl } = req.body || {};
  if (!listingUrl || !/^https?:\/\//.test(listingUrl)) {
    return res.status(400).json({ ok: false, error: 'Invalid URL' });
  }

  try {
    const response = await fetch(listingUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return res.status(502).json({ ok: false, error: `Upstream returned ${response.status}` });
    }

    const html = await response.text();
    const data = {};

    // ── Layer 1: __YLOPO_APP_CONTEXT__ (Ylopo-hosted search sites) ──
    const ylopoMatch = html.match(/var __YLOPO_APP_CONTEXT__=(.+?);<\/script>/s);
    if (ylopoMatch) {
      try {
        const ctx = JSON.parse(ylopoMatch[1]);
        const l = ctx?.prefetchData?.listing;
        if (l) {
          const addr = l.address || {};
          const addrStr = addr.fullStreetAddress || '';
          const numMatch = addrStr.match(/^(\d+)\s+(.*)/);
          data.addressNumber = numMatch ? numMatch[1] : '';
          data.street        = numMatch ? numMatch[2] : addrStr;
          data.city          = addr.city || '';
          data.state         = addr.stateOrProvince || '';
          data.zip           = addr.postalCode || '';
          data.price         = Math.round(parseFloat(l.price) || 0);
          data.beds          = l.bedrooms || 0;
          data.baths         = l.bathrooms || l.fullBathrooms || 0;
          data.sqft          = l.livingAreaSqFt || 0;
          data.yearBuilt     = l.yearBuilt || 0;
          data.mls           = l.mlsNumber || '';
          data.description   = l.descriptions?.PUBLIC_REMARKS || '';
          if (addr.mlsLatitude)  data.lat = parseFloat(addr.mlsLatitude);
          if (addr.mlsLongitude) data.lng = parseFloat(addr.mlsLongitude);
          if (Array.isArray(l.largeListingPhotos) && l.largeListingPhotos.length) {
            data.photos = l.largeListingPhotos.slice(0, 30);
          }
        }
      } catch { /* continue */ }
    }

    // ── Layer 2: __NEXT_DATA__ (other Next.js listing sites) ──
    if (!data.price) {
      const ndMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
      if (ndMatch) {
        try {
          const nd = JSON.parse(ndMatch[1]);
          const pp = nd?.props?.pageProps || {};
          const l = pp.listing || pp.property || pp.listingDetail?.listing || pp.initialData?.listing || null;
          if (l) {
            const numMatch = (l.streetAddress || l.fullAddress || '').match(/^(\d+)\s+(.*)/);
            data.addressNumber = l.streetNumber || (numMatch ? numMatch[1] : '');
            data.street        = l.streetName   || (numMatch ? numMatch[2] : l.streetAddress || '');
            data.city          = l.city || '';
            data.state         = l.stateOrProvince || l.state || '';
            data.zip           = l.postalCode || l.zipCode || '';
            data.price         = l.listPrice || l.price || 0;
            data.beds          = l.bedroomsTotal || l.bedrooms || 0;
            data.baths         = l.bathroomsFull || l.bathrooms || 0;
            data.sqft          = l.livingArea || l.squareFeet || 0;
            data.yearBuilt     = l.yearBuilt || 0;
            data.mls           = l.mlsNumber || l.listingId || l.id || '';
            data.description   = l.publicRemarks || l.description || '';
            if (Array.isArray(l.media)) {
              data.photos = l.media.map(m => m.mediaURL || m.url || m.MediaURL || '').filter(Boolean).slice(0, 30);
            } else if (Array.isArray(l.photos)) {
              data.photos = l.photos.map(p => p.url || p.mediaURL || p).filter(s => typeof s === 'string').slice(0, 30);
            }
          }
        } catch { /* continue */ }
      }
    }

    // ── Layer 3: og: meta tag fallbacks ──
    if (!data.photos?.length) {
      const ogImg = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
      if (ogImg) data.photos = [ogImg[1]];
    }
    if (!data.description) {
      const ogDesc = html.match(/<meta[^>]+(?:property="og:description"|name="description")[^>]+content="([^"]+)"/);
      if (ogDesc) data.description = ogDesc[1];
    }

    return res.status(200).json({ ok: true, data });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};
