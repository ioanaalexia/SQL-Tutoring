const AdminController = require('../controllers/AdminController');
const adminController = new AdminController();


function AdminRoutes(req, res, pathname, method) {
    
    switch(method) {
        case 'GET':
            handleGetRequest(req, res, pathname);
            break;
        case 'POST':
            handlePostRequest(req, res, pathname);
            break;
        default:
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed');
            break;
    }
}

function handleGetRequest(req, res, pathname, userData) {
 if(pathname === '/scores'){
    console.log("Scoruri din routes");
    adminController.getUserScore(req, res);
 }
}

module.exports = AdminRoutes;