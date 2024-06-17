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
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, question: result.message }));
        }
    }

}

module.exports = QuestionController;
