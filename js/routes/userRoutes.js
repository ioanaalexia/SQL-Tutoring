const UserController = require('../controllers/UserController');
const userController = new UserController();

function userRoutes(req, res, pathname, method) {
    if (method === 'POST' && pathname === '/signup') {
        userController.newUser(req, res);
    } else if (method === 'POST' && pathname === '/login') {
        userController.loginUser(req, res);
    } else {
        // Nu s-a găsit ruta solicitată
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
}

module.exports = userRoutes;
