// Writes a JSON file to the GitHub repo and commits it.
// Requires GITHUB_TOKEN env var (fine-grained PAT with Contents: read+write).
// Optionally protected by ADMIN_SECRET env var.

const SECRET       = process.env.ADMIN_SECRET;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO  = process.env.GITHUB_REPO || 'jomylopo/Palisade_Realty';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (SECRET && req.headers['x-admin-secret'] !== SECRET) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ ok: false, error: 'GITHUB_TOKEN is not configured in Vercel environment variables.' });
  }

  const file = (req.query.file || '').replace(/[^a-z0-9-]/gi, '');
  if (!file) return res.status(400).json({ ok: false, error: 'Invalid file name' });

  const filePath = `data/${file}.json`;
  let bodyStr;
  try {
    bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body, null, 2);
    JSON.parse(bodyStr); // validate JSON before writing
  } catch {
    return res.status(400).json({ ok: false, error: 'Invalid JSON body' });
  }

  const ghHeaders = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'Palisade-Admin/1.0',
  };
  const apiBase = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;

  try {
    // Get current file SHA (required for updates)
    const getRes = await fetch(apiBase, { headers: ghHeaders });
    const getJson = await getRes.json();
    if (!getRes.ok && getRes.status !== 404) {
      return res.status(502).json({ ok: false, error: `GitHub GET failed: ${getJson.message}` });
    }
    const sha = getJson.sha; // undefined for new files

    // Commit the updated file
    const content = Buffer.from(bodyStr, 'utf8').toString('base64');
    const message = req.query.commit || `Update ${file} via admin`;
    const putBody = { message, content };
    if (sha) putBody.sha = sha;

    const putRes = await fetch(apiBase, {
      method: 'PUT',
      headers: ghHeaders,
      body: JSON.stringify(putBody),
    });
    const putJson = await putRes.json();

    if (putRes.ok) {
      return res.status(200).json({ ok: true, committed: true, pushed: true, commit: putJson.commit?.sha });
    } else {
      return res.status(502).json({ ok: false, committed: false, pushed: false, error: putJson.message });
    }
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};
