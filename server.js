const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const { StringDecoder } = require('string_decoder');
const UserController = require('./js/controllers/UserController');
const userController = new UserController();

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    

    if (req.method === 'GET') {
    
        if (pathname.match(/\.(html|css|js|png|jpg|jpeg|svg)$/)) {
            serveStaticFile(res, pathname);
           
            return;
        }

        // Servește pagina principală
        if (pathname === '/') {
            fs.readFile('./html/index.html', 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("404 Not Found");
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data);
                }
            });
        }
        else {
            res.writeHead(404);
            res.end("404 Not Found");
        }
    } else if (req.method === 'POST') {
        console.log(pathname)

            
            if (pathname === '/login') {
                await userController.loginUser(req, res);    
            } else if(pathname === '/signup'){
                await userController.newUser(req, res);
            }
            else {
                res.writeHead(404);
                res.end("404 Not Found");
            }
    } else {
        res.writeHead(405);
        res.end("405 Method Not Allowed");
    }
});

function parseFormData(data) {
    const pairs = data.split('&');
    const formData = {};
    pairs.forEach(pair => {
        const [key, value] = pair.split('=');
        formData[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
    });
    return formData;
}

function serveStaticFile(res, pathname) {
    const filePath = path.join(__dirname,pathname);
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
            return;
        }
        res.writeHead(200, {'Content-Type': mimeTypes[ext] || 'text/plain'});
        res.end(content);
    });
}

server.listen(3500, () => {
    console.log('Server is running on http://localhost:3500');
});

