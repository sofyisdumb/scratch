export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await fetch(`https://api.scratch.mit.edu/projects/${id}`);
    if (!response.ok) throw new Error();
    const data = await response.json();

    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.title}</title>
          <meta property="og:title" content="${data.title}" />
          <meta property="og:description" content="View ${data.title} by ${data.author.username} on my custom portal." />
          <meta property="og:image" content="${data.images['282x210']}" />
          <meta name="twitter:card" content="summary_large_image">
          <meta name="theme-color" content="#4d97ff">
          <script>window.location.href = 'https://scratch.mit.edu/projects/${id}';</script>
        </head>
        <body>Redirecting to Scratch...</body>
      </html>
    `);
  } catch (e) {
    res.status(404).send("Project not found");
  }
}