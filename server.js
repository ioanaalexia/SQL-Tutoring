const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const cookie = require('cookie');
const routeController = require('./js/routes/userRoutes');

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (pathname.startsWith('/api/') || pathname === '/login' || pathname === '/signup' || pathname === '/logout' || pathname === '/change-password') {
        routeController(req, res, pathname, method);
    } else if(pathname==='/html/start.html'){
        console.log("sunt pe start")
        await userController.startupUser(req, res);    
    } 
    else if (pathname.match(/\.(html|css|js|png|jpg|jpeg|svg)$/)) {
        serveStaticFile(res, pathname);
    } else if (pathname === '/') {
        fs.readFile('./html/index.html', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("404 Not Found");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404);
        res.end("404 Not Found");
    }
});

function serveStaticFile(res, pathname) {
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath);
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml'
    };

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end("File not found");
        } else {
            res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'text/plain'});
            res.end(content);
        }
    });
}

server.listen(3500, () => {
    console.log('Server is running on http://localhost:3500');
});