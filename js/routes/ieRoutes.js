const IEController = require('../controllers/IEController');
const ieController = new IEController();


function IERoutes(req, res, pathname, method) {
    
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

function handleGetRequest(req, res, pathname) {
   
    if (pathname === '/exportXml') {
        ieController.exportXml(req, res);
    }
    else if(pathname === '/exportJson')
        {
            console.log("in rutare pt export")
            ieController.exportJson(req, res);
        } 
     else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

function handlePostRequest(req, res, pathname) {
    if (pathname === '/import') {
       ieController.import(req, res);
    }        
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}


module.exports = IERoutes;
