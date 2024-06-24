const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const cookie = require('cookie');
const routeController = require('./js/routes/userRoutes');
const questionController = require('./js/routes/questionRoutes');
const ieController=require('./js/routes/ieRoutes');
const adminController=require('./js/routes/adminRoutes');
const middleware=require('./js/middleware/AuthMiddleware');


const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    console.log(pathname)
    const method = req.method;
    const ext = path.extname(pathname);

    if (pathname.startsWith('/api/') || pathname === '/api/user-statistics' || pathname === '/login' || pathname === '/signup' || pathname === '/logout' || pathname === '/api/update-profile') {
        routeController(req, res, pathname, method);
      } else if(pathname === '/' || pathname === '/question' || pathname === '/questions' || pathname==='/answer' || pathname==='/rating' ||pathname==='/comment' || pathname==="/verifyCount" || pathname==="/query" || pathname==="/addQuestion" || pathname === '/incorrectProblem'){
        if (middleware.requireAuth(req)){ 
        questionController(req,res,pathname,method);
        }
    }else if(pathname==='/scores'){
      if (middleware.requireAuth(req)){ 
       adminController(req,res,pathname,method);
      }
    }else if(pathname === '/import' || pathname === '/exportXml' || pathname === '/exportJson'){
      if (middleware.requireAuth(req)){ 
        ieController(req,res,pathname,method);
      }
    }else if (ext.match(/\.(html|css|js|png|jpg|jpeg|svg)$/)) {
            if (ext === '.html') {
              console.log("path" + pathname);
              if (pathname !== '/html/index.html' && pathname !== '/html/help.html' && pathname !== '/html/login_signup.html' && pathname !== '/login' && pathname !== '/html/ajutor.html' && pathname!=='/html/despre.html') {
                if (middleware.requireAuth(req)) {
                  console.log("Authenticated");
                  serveStaticFile(res, pathname);
                } else {
                  console.log("Not Authenticated");
                  res.writeHead(302, { 'Location': '/html/login_signup.html' });
                  res.end();
                }
              } else {
                serveStaticFile(res, pathname);
              }
            } else {
              serveStaticFile(res, pathname);
            }
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });


function serveStaticFile(res, pathname) {
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath);
    console.log(ext)
    
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

server.listen(3900, () => {
    console.log('Server is running on http://localhost:3900');
});