export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.redirect('https://scratch.mit.edu');
  }

  const thumb = `https://uploads.scratch.mit.edu/get_image/project/${id}_480x360.png`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`https://api.scratch.mit.edu/projects/${id}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    clearTimeout(timeoutId);
    const data = await response.json();
    const title = data.title || "Scratch Project";

    render(res, title, id, thumb);

  } catch (e) {
    render(res, "Scratch Project " + id, id, thumb);
  }
}

function render(res, title, id, thumb) {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <meta property="og:title" content="${title}">
      <meta property="og:image" content="${thumb}">
      <meta property="og:description" content="View this project on my custom portal.">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="theme-color" content="#4d97ff">
      <meta http-equiv="refresh" content="0;url=https://scratch.mit.edu/projects/${id}/">
    </head>
    <body style="background: #000;">
      <script>window.location.replace("https://scratch.mit.edu/projects/${id}/");</script>
    </body>
    </html>
  `);
}