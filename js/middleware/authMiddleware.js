const jwt=require('jsonwebtoken')
const cookie=require('cookie')
const AuthService = require('../services/AuthService');

const authService=new AuthService();

const requireAuth=(res,req,next)=>{
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.authToken;

    if(token){
        jwt.verify(token,authService,(err,decodedToken)=>{
            if(err){
            console.log(err.message)
            res.writeHead(302, { 'Location': '/html/login_signup.html' });
            res.end();
            }
            else{
              console.log(decodedToken);
              next(); 
            }
        })
    }else{
        res.writeHead(302, { 'Location': '/html/login_signup.html' });
        res.end(); 
    }
}