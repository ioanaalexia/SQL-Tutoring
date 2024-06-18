const cookie=require('cookie')


const setCookie = (res, name, value, options = {}) => {
    let cookieString = `${name}=${value}`;

    if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
    if (options.path) cookieString += `; Path=${options.path}`;
    if (options.expires) cookieString += `; Expires=${options.expires.toUTCString()}`;
    if (options.httpOnly) cookieString += '; HttpOnly';
    if (options.secure) cookieString += '; Secure';

    res.setHeader('Set-Cookie', cookieString);
};


module.exports={
   setCookie
   
}