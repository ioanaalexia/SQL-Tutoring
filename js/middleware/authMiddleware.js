
const cookie=require("cookie");
const jwt=require('jsonwebtoken')
const AuthService = require('../services/AuthService');
const utils=require('../utils')
const authService=new AuthService();

const requireAuth=(req,res,next)=>{
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.authToken;
    console.log(token);
    if (token) {
        try {
          const decodedToken = jwt.verify(token, authService.secret);
          console.log(decodedToken);
          return true;
        } catch (err) {
          console.log(err.message);
          return false;
        }
      } else {
        return false;
      }
}
module.exports={
    requireAuth
}