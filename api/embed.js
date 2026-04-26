export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || isNaN(id)) {
    return res.status(400).send("Invalid ID");
  }

  try {
    const response = await fetch(`https://api.scratch.mit.edu/projects/${id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.send(`<html><head><meta http-equiv="refresh" content="0;url=https://scratch.mit.edu/projects/${id}/"></head></html>`);
    }

    const data = await response.json();
    const thumb = `https://uploads.scratch.mit.edu/get_image/project/${id}_282x210.png`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=3600');

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${data.title}</title>
        <meta property="og:title" content="${data.title}">
        <meta property="og:description" content="By ${data.author.username}">
        <meta property="og:image" content="${thumb}">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="theme-color" content="#4d97ff">
        <meta http-equiv="refresh" content="0;url=https://scratch.mit.edu/projects/${id}/">
      </head>
      <body style="background:#000; color:white;">
        <script>window.location.replace("https://scratch.mit.edu/projects/${id}/");</script>
        Redirecting to Scratch...
      </body>
      </html>
    `);

  } catch (error) {
    return res.redirect(`https://scratch.mit.edu/projects/${id}/`);
  }
}