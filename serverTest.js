const http = require('http');
const url = require('url');
const AuthentificationService = require('./js/services/AuthentificationService');

const authService = new AuthentificationService();

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (req.method === 'GET') {
    if (pathname === '/encrypt') {
      const { userId, username } = query;
      try {
        const { jwe } = await authService.encryptData(userId, username);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ jwe }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Encryption Error: ${error.message}`);
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const parsedBody = JSON.parse(body);
      if (pathname === '/decrypt') {
        const { jwe } = parsedBody;
        try {
          const decryptedPayload = await authService.decryptData(jwe);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(decryptedPayload));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end(`Decryption Error: ${error.message}`);
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
