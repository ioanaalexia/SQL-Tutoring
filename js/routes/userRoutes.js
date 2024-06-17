const UserController = require('../controllers/UserController');
const userController = new UserController();

// Functia de routing pentru utilizator
function routeController(req, res, pathname, method) {
    if (method === 'POST') {
        if (pathname === '/signup') {
            userController.newUser(req, res);
        } else if (pathname === '/login') {
            userController.loginUser(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    } else if (method === 'GET') {
        if (pathname === '/logout') {
            userController.logoutUser(req, res);
        } else if (pathname === '/api/user-info') {
            if (userData) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(userData));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not authenticated' }));
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
}

module.exports = routeController;
