const BaseController = require('./BaseController');
const UserModel = require('../models/UserModel');


//@desc signing up a user
//@route POST /signup

class UserController extends BaseController {
    constructor() {
        super();
        this.userModel = new UserModel();
    }

    async  newUser(req,res){

    try {
        const userData = await this.parseFormData(await this.getPostData(req));
        const result = await this.userModel.addNewUser(userData);
        console.log(result)
        if (!result.success) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: result.message }));
        } else {
           
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, redirectUrl: '/html/elev.html' }));
        }
    } catch (error) {
        console.error('Eroare la primirea datelor:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('A apărut o eroare la procesarea datelor');
    }

}

    async loginUser(req,res){

    try {
        const userData = await this.parseFormData(await this.getPostData(req));
        const result = await this.userModel.verifyUser(userData);
       // console.log(userData)
        console.log(result)
        if (!result.success) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: result.message }));
        } else {
           
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, redirectUrl: '/html/elev.html' }));
        }
    } catch (error) {
        console.error('Eroare la primirea datelor:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('A apărut o eroare la procesarea datelor');
    }

}
}




module.exports = UserController;