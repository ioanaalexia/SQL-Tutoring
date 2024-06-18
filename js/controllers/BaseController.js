const querystring = require('querystring');
class BaseController {
    constructor() {
        if (new.target === BaseController) {
            throw new Error("Clasa BaseController nu poate fi instanțiată direct.");
        }
    }

    
async getPostData(req){
    return new Promise((resolve, reject) => {
    try{

        let body=''
        req.on('data',(chunk)=>{
            body+=chunk.toString()
        })

        req.on('end',()=>{
            resolve(body)
        })
    }catch(error){
        reject(error)
    }  
    })
}

async parseFormData(formDataString) {
    // Parsarea datelor primite în formă de șir de interogare
    const formData = querystring.parse(formDataString);

    // Rezultatul este un obiect cu chei corespunzătoare datelor primite
    return formData;
}






    sendJsonResponse(res, statusCode, data) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }
}

module.exports = BaseController;
