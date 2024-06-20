const QuestionModel = require("../models/QuestionModel");
const BaseController = require("./BaseController");
const querystring = require('querystring');
const url = require('url');

class QuestionController extends BaseController {

    constructor() {
        super();
        this.questionModel = new QuestionModel();
    }

    async getQuestion(req, res, userData) {
        console.log("sunt in controler");
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        const chapterName = queryParams.chapter;
        console.log(chapterName);

        const result = await this.questionModel.load(chapterName, userData.id);
        console.log(result);
        if (!result.success) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: result.message }));
        } else {
            res.setHeader('Set-Cookie', `questionText=${result.message}; HttpOnly; Path=/; Max-Age=86400`);
            res.setHeader('Set-Cookie', `questionId=${result.questionId}; HttpOnly; Path=/; Max-Age=86400`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, question: result.message }));
        }
    }

    async verifyAnswer(req,res,questionId,userData){
        const answer=await this.getPostData(req)
        const result=await this.questionModel.verifyAnswer(answer,questionId,userData.id)
        if(result)
            {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: "corect" }));
            }
        else{
            res.writeHead(406, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: "incorect"}));
        
    }

    
}

    async sendRating(req, res,questionId,userData){
        const parsedUrl = url.parse(req.url, true);
        console.log("in controler")
        // Extrage valoarea parametrului "dificultate"
        const dificultate = parsedUrl.query.dificultate;

        const result=await this.questionModel.sendRating(questionId,userData.id,dificultate);
        if(result)
            {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: "updated" }));
            }
        else{
            res.writeHead(406, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: "notUpdated"}));
        
    }
    }

    async addComment(req, res,questionId,userData)
    {
        const comment=await this.getPostData(req)
        console.log(comment)
        const result=await this.questionModel.addComment(comment,questionId,userData.id)
        console.log(result)
        if(result)
            {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: "corect" }));
            }
        else{
            res.writeHead(406, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: "incorect"}));
        
    } 
    }
    async verifyCount(req, res,userData){
        const result=await this.questionModel.verifyCount(userData.id)
        console.log(result)
        if(result===1)
            {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: "redirect" }));
            }
        else{
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: "corect" }));
            
        
    }
}

}

module.exports = QuestionController;
