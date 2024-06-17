const QuestionController = require('../controllers/QuestionController');
const cookie=require('cookie')
const AuthService = require('../services/AuthService');
const authService= new AuthService();
const questionController = new QuestionController();

function questionRoutes(req, res, pathname, method) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.authToken;
    const userData = token ? authService.decodeToken({ headers: { cookie: req.headers.cookie } }) : null;
    //console.log(userData)
    switch(method) {
        case 'GET':
            handleGetRequest(req, res, pathname, userData);
            break;
        /*case 'POST':
            handlePostRequest(req, res, pathname, userData);
            break;*/
        default:
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed');
            break;
    }
}

function handleGetRequest(req, res, pathname, userData) {
    console.log(userData)
    if (pathname === '/getQuestion') {
        questionController.getQuestion(req, res,userData);
    } 
     else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

/*function handlePostRequest(req, res, pathname, userData) {
    if (pathname === '/login') {
        userController.loginUser(req, res);
    } else if (pathname === '/signup') {
        userController.newUser(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}*/

module.exports = questionRoutes;
