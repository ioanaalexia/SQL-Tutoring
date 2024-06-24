const BaseController = require('./BaseController');
const UserModel = require('../models/UserModel');
const AuthService=require('../services/AuthService');
const utils=require('../utils')
const cookie=require('cookie')
//@desc signing up a user
//@route POST /signup

class UserController extends BaseController {
    constructor() {
        super();
        this.userModel = new UserModel();
    }

    async startupUser(req,res){
        this.userModel.startupUser(req,res);
    }

    async  newUser(req,res){

    try {
        const userData = await this.parseFormData(await this.getPostData(req));
        const result = await this.userModel.addNewUser(userData);
        if (!result.success) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: result.message }));
        } else {
            res.setHeader('Set-Cookie', `authToken=${result.token}; HttpOnly; Path=/; Max-Age=86400`);
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
            console.log(result)
            if(result.message==='User authenticated successfully'){

                res.setHeader('Set-Cookie', `authToken=${result.token}; HttpOnly; Path=/; Max-Age=86400`);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, redirectUrl: '/html/elev.html' }));

            }else if(result.message==='Admin authenticated successfully')
                {
                    res.setHeader('Set-Cookie', `authToken=${result.token}; HttpOnly; Path=/; Max-Age=86400`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, redirectUrl: '/html/admin.html' }));
        
                }
        }
    } catch (error) {
        console.error('Eroare la primirea datelor:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('A apărut o eroare la procesarea datelor');
      }
    }

    async logoutUser(req,res){
        utils.setCookie(res, 'authToken', '', { maxAge: 1 });
        res.writeHead(302, { 'Location': '/html/index.html' });
        res.end();
    }

    async updateProfile(req, res, userData) {
        try {
            //console.log(this.getPostData(req));
           // Presupunem că getPostData(req) îți returnează un string JSON
            const profileDataString = await this.getPostData(req);
            // Parsează string-ul JSON într-un obiect
            const profileData = JSON.parse(profileDataString);
            console.log('Profile data received:', profileData);

            const updatedUser = await this.userModel.updateUserProfile(userData.id, profileData);
            
            console.log(updatedUser);
            console.log("userData");
            
            if (updatedUser) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Profile updated successfully' }));
            } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Failed to update profile' }));
            }
        } catch (error) {
            console.error('Erroare la actualizarea profilului:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('A aparut o eroare la actualizarea profilului');
        }
    }


    async getUserStatistics(req, res) {
        try {
            const userId = req.userData && req.userData.id;
            console.log('User ID:', userId);
            if (!userId) {
                throw new Error('User ID is not defined');
            }
            const userStatistics = await this.userModel.getUserStatistics(userId);
            console.log("Statistici:", userStatistics);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(userStatistics));
        } catch (error) {
            console.error('Error fetching user statistics:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Failed to fetch user statistics' }));
        }
    }


    async getProblems(req, res) {
        try {
            const userId = req.userData && req.userData.id;
            console.log('User ID:', userId);
            if(!userId){
                throw new Error('User ID is not defined')
            }
            const problems = await this.userModel.getProblems(userId);
            console.log("Rezultatele sunt: ", problems);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(problems));
        } catch (error) {
            console.error('Error fetching problems:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Failed to fetch problems' }));
        }
    }

}

module.exports = UserController;