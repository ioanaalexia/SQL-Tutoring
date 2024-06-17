const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
<<<<<<< Updated upstream
const cookie = require('cookie');
const routeController = require('./js/routes/userRoutes');
=======
const cookie=require('cookie')
const { StringDecoder } = require('string_decoder');
const UserController = require('./js/controllers/UserController');
const AuthService = require('./js/services/AuthService');
const userController = new UserController();
const authService= new AuthService();
>>>>>>> Stashed changes

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const cookies = cookie.parse(req.headers.cookie || '');
<<<<<<< Updated upstream
    const method = req.method;

    if (pathname.startsWith('/api/') || pathname === '/login' || pathname === '/signup' || pathname === '/logout') {
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
=======
    const token = cookies.authToken;
    const userData = token ? authService.decodeToken({ headers: { cookie: req.headers.cookie } }) : null;
    
    if (req.url === '/api/user-info' && req.method === 'GET') {
        if (userData) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userData));
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not authenticated' }));
        }
        return;
    }

    if (req.method === 'GET') {
        
       

        if(pathname==='/html/start.html'){
            console.log("sunt pe start")
            await userController.startupUser(req, res);    
        }
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
        }else if(pathname==='/logout'){
            await userController.logoutUser(req, res); 
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
>>>>>>> Stashed changes
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
