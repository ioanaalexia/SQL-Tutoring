const AdminModel = require("../models/AdminModel");
const BaseController = require("./BaseController");

class AdminController extends BaseController {
    constructor() {
        super();
        this.adminModel = new AdminModel();
    }
    async getUserScore(req, res){
    try{
        const userScores = await this.adminModel.getUserScores();
        console.log("Scorurile sunt: ", userScores);
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify(userScores));
    }catch(error){
        console.error('Error fetching user scores: ', error);
        res.writeHead(500, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify({message: 'Failed to fetch user scores'}));
    }
    }
}

module.exports=AdminController;