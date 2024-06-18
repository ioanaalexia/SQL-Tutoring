const jwt = require('jsonwebtoken');
const cookie=require('cookie')

class AuthService {

  constructor(){
    this.secret = 'mysupersecret';
  }


  generateToken (UserAuthData) {
  
  const payload = {
    id: UserAuthData.userId,
    username: UserAuthData.username,
    email: UserAuthData.email
  };
  console.log(payload)

  // Crearea token-ului
  const token = jwt.sign(payload, this.secret, { expiresIn: '1h' });

  return token;
}

decodeToken(req) {
  var cookies = cookie.parse(req.headers.cookie || '');
  var token = cookies.authToken;

  try {
    const decoded = jwt.verify(token, this.secret);
    return decoded;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}


}


module.exports=AuthService;