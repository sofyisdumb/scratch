export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).send("ID required");

    try {
        const response = await fetch(`https://api.scratch.mit.edu/projects/${id}`);
        const data = await response.json();

        const thumb = `https://uploads.scratch.mit.edu/get_image/project/${id}_282x210.png`;

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 'public, max-age=3600');

        const html = `
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
<body style="background:#000;">
  <script>window.location.replace("https://scratch.mit.edu/projects/${id}/");</script>
</body>
</html>`;

        return res.status(200).send(html);
    } catch (e) {
        return res.redirect(`https://scratch.mit.edu/projects/${id}/`);
    }
}