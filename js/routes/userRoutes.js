const UserController = require('../controllers/UserController');
const cookie=require('cookie')
const AuthService = require('../services/AuthService');
const userController = new UserController();
const authService= new AuthService();

function userRoutes(req, res, pathname, method) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.authToken;
    const userData = token ? authService.decodeToken({ headers: { cookie: req.headers.cookie } }) : null;

    switch(method) {
        case 'GET':
            handleGetRequest(req, res, pathname, userData);
            break;
        case 'POST':
            handlePostRequest(req, res, pathname, userData);
            break;
        default:
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed');
            break;
    }
}

function handleGetRequest(req, res, pathname, userData) {
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
}

function handlePostRequest(req, res, pathname, userData) {
    if (pathname === '/login') {
        userController.loginUser(req, res);
    } else if (pathname === '/signup') {
        userController.newUser(req, res);
    } else if (pathname === '/update-profile') {
        userController.updateProfile(req, res, userData);
    } else if (pathname === '/change-password') {
        userController.changePassword(req, res, userData);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

module.exports = userRoutes;
