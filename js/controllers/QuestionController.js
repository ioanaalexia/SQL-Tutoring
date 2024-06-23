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
    async addQuestion(req,res,userData){
        
        console.log("in controler")
        const queryString=await this.getPostData(req)
        console.log(queryString)
        const parsedData = querystring.parse(queryString);

        console.log(parsedData.dificultate)
        // Extrage fiecare dată din obiectul rezultat
       
       
        const result=await this.questionModel.addQuestion(parsedData.capitol,parsedData.intrebare,parsedData.dificultate,parsedData.raspuns,userData.id)
        if (result) {
            res.writeHead(302, { 
                'Location': '/html/start.html', 
                'Content-Type': 'text/html' 
            });
            res.end(JSON.stringify({ success: true, message: "Intrebare inserata" }));
        } else {
            res.writeHead(302, { 
                'Location': '/html/tryAgain.html', 
                'Content-Type': 'text/html' 
            });
            res.end(JSON.stringify({ success: false, message: "Raspuns gresit" }));
        }
                
    }
    async getQuery(req, res) {
        const parsedUrl = url.parse(req.url, true);
        console.log("in controler");
        
        // Extrage valoarea parametrului "dificultate"
        const id = parsedUrl.query.id;
        const category = parsedUrl.query.category;
        console.log(id, category);
    
        if (id) {
            try {
                const result = await this.questionModel.getQueryById(id);
                if (result) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: "Intrebarea nu a fost gasita" }));
                }
            } catch (error) {
                console.error("Error fetching question by ID:", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: "Eroare interna de server" }));
            }
    
        } else if (category) {
            try {
                const result = await this.questionModel.getQueryByCategory(category); // Ar trebui să fie 'category' în loc de 'id' aici
                if (result) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: "Nu s-au găsit întrebări în categoria specificată" }));
                }
            } catch (error) {
                console.error("Error fetching questions by category:", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: "Eroare interna de server" }));
            }
        } else {
            const result = await this.questionModel.getQueries(); // Ar trebui să fie 'category' în loc de 'id' aici
            if (result) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: "Nu s-au găsit întrebări" }));
            }

            }
    }
    
}



module.exports = QuestionController;
