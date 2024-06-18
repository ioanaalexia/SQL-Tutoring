const QuestionController = require('../controllers/QuestionController');
const cookie=require('cookie')
const AuthService = require('../services/AuthService');
const authService= new AuthService();
const questionController = new QuestionController();

function questionRoutes(req, res, pathname, method) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.authToken;
    const userData = token ? authService.decodeToken({ headers: { cookie: req.headers.cookie } }) : null;
    const questionId = cookies.questionId;

    //console.log(userData)
    switch(method) {
        case 'GET':
            handleGetRequest(req, res, pathname, userData);
            break;
        case 'POST':
            handlePostRequest(req, res, pathname, userData,questionId);
            break;
        default:
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed');
            break;
    }
}

function handleGetRequest(req, res, pathname, userData) {
    console.log(userData)
    if (pathname === '/getQuestion') {
        console.log("in get quesrion")
        questionController.getQuestion(req, res,userData);
    } 
     else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

function handlePostRequest(req, res, pathname, userData,questionId) {
    if (pathname === '/addAnswer') {
      
        questionController.verifyAnswer(req, res,questionId,userData);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

module.exports = questionRoutes;
