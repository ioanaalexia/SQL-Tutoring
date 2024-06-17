const bcrypt = require('bcrypt');
const saltRounds = 10;
const connectionPromise = require('../database');
const AuthService = require('../services/AuthService');

class UserModel {
    constructor() {
        this.saltRounds = 10;
        this.authService = new AuthService();
    }

    async generateUserId() {
        return Math.floor(Math.random() * 1000000) + 1; 
    }
    async startupUser(req,res){
        const response=this.authService.decodeToken(req,res);
        console.log(response)
    }
    async addNewUser(userData) {
        userData.user_id = await this.generateUserId();
        const connection = await connectionPromise;

        if (await this.isRegistered(connection, userData.username) || await this.alreadyExists(connection, userData.email)) {
            return { success: false, message: 'Username or email already exists!' };
        }

        try {
            const hashedPass = bcrypt.hashSync(userData.parola, this.saltRounds);
            const values = [userData.user_id, userData.username, userData.email, hashedPass];
            const sql = 'INSERT INTO `users`(`user_id`, `username`, `email`, `password`) VALUES (?,?,?,?)';
            await connection.execute(sql, values);
            const token = this.authService.generateToken({
                userId: userData.user_id,
                username: userData.username,
                email: userData.email
              });
              //trebuie adaugat si rolul!!!
            return { success: true, token, message: 'User registered successfully' };
        } catch (err) {
            console.log(err);
            return { success: false, message: 'An error occurred during registration' };
        }
    }

    async verifyUser(userData) {
        const connection = await connectionPromise;
        try {
            const sql = 'SELECT user_id,username,password FROM users WHERE email=?';
            const [result] = await connection.execute(sql, [userData.email]);
            if (result.length > 0 && await bcrypt.compare(userData.parola, result[0].password)) {
                const token = this.authService.generateToken({
                    userId: result[0].user_id,
                    username: result[0].username,
                    email: userData.email
                  });
               // res.setHeader('Set-Cookie', `authToken=${token}; HttpOnly; Path=/; Max-Age=86400`);
                return { success: true,token, message: 'User authenticated successfully' };
            }
            return { success: false, message: 'Invalid email or password' };
        } catch (err) {
            console.log(err);
            return { success: false, message: 'An error occurred' };
        }
    }

    async isRegistered(connection, username) {
        const sql = 'SELECT * FROM users WHERE username=?';
        const [result] = await connection.execute(sql, [username]);
        return result.length > 0;
    }

    async alreadyExists(connection, email) {
        const sql = 'SELECT * FROM users WHERE email=?';
        const [result] = await connection.execute(sql, [email]);
        return result.length > 0;
    }
}

module.exports = UserModel;
