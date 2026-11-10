// Cloudflare Worker: GET /?user=<github-login>
// Keeps your GitHub token server-side, caches 10 minutes at the edge, locks CORS to your site.

const QUERY = `query($login:String!,$from:DateTime!,$to:DateTime!){
  user(login:$login){contributionsCollection(from:$from,to:$to){contributionCalendar{
    totalContributions weeks{contributionDays{date contributionCount weekday}}}}}}`;

const json = (body, status, headers) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });

export default {
  async fetch(req, env, ctx) {
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0] || '',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      Vary: 'Origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'GET') return json({ error: 'method not allowed' }, 405, cors);

    const url = new URL(req.url);
    const user = (url.searchParams.get('user') || env.DEFAULT_USER || '').trim();
    if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(user)) return json({ error: 'invalid user' }, 400, cors);

    const cache = caches.default;
    const key = new Request(`${url.origin}/cache/${user.toLowerCase()}`);
    const hit = await cache.match(key);
    if (hit) {
      const r = new Response(hit.body, hit);
      for (const [k, v] of Object.entries(cors)) r.headers.set(k, v);
      return r;
    }

    const to = new Date(), from = new Date(to);
    from.setFullYear(to.getFullYear() - 1);
    from.setDate(from.getDate() + 1);               // GitHub rejects ranges over one year

    const gh = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-heatmap',
      },
      body: JSON.stringify({ query: QUERY, variables: { login: user, from: from.toISOString(), to: to.toISOString() } }),
    });
    if (!gh.ok) return json({ error: 'github ' + gh.status }, 502, cors);

    const data = await gh.json();
    const cal = data?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return json({ error: data?.errors?.[0]?.message || 'user not found (must be a user account)' }, 404, cors);

    const out = {
      user,
      total: cal.totalContributions,
      weeks: cal.weeks.map((w) => w.contributionDays.map((d) => ({ d: d.date, c: d.contributionCount, w: d.weekday }))),
    };
    const res = json(out, 200, { ...cors, 'Cache-Control': 'public, max-age=600' });
    ctx.waitUntil(cache.put(key, res.clone()));
    return res;
  },
};
