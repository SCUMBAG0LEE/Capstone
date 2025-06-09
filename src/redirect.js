const http = require('http');

http.createServer((req, res) => {
  const host = req.headers.host;
  res.writeHead(301, { Location: `https://${host}${req.url}` });
  res.end();
}).listen(80, () => console.log('Redirect server running on port 80'));