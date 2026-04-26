export default async function handler(req, res) {
    const { id } = req.query;

    if (!id || isNaN(id)) {
        return res.status(400).send("Invalid Project ID");
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(`https://api.scratch.mit.edu/projects/${id}`, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Not Found");
        const data = await response.json();

        const thumb = data.images['510x312'] || data.images['282x210'];

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 's-maxage=86400');

        return res.send(`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>${data.title}</title>
    <meta property="og:site_name" content="Scratch Portal">
    <meta property="og:title" content="${data.title}" />
    <meta property="og:description" content="By ${data.author.username} — ${data.description.substring(0, 150)}..." />
    <meta property="og:image" content="${thumb}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image">
    <meta name="theme-color" content="#4d97ff">
    
    <script>window.location.href = 'https://scratch.mit.edu/projects/${id}/';</script>
  </head>
  <body style="background: #111; color: white;">
    Redirecting to ${data.title}...
  </body>
</html>
    `);
    } catch (e) {
        return res.send(`<script>window.location.href = 'https://scratch.mit.edu/projects/${id}/';</script>`);
    }
}