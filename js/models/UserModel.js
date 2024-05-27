const bcrypt = require('bcrypt');
const saltRounds = 10;
const connectionPromise = require('../database');

class UserModel {
    constructor() {
        this.saltRounds = 10;
    }

    async generateUserId() {
        return Math.floor(Math.random() * 1000000) + 1; 
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
            const sql = 'INSERT INTO `users`(`user_id`, `username`, `email`, `parola`) VALUES (?,?,?,?)';
            await connection.execute(sql, values);
            return { success: true, message: 'User registered successfully' };
        } catch (err) {
            console.log(err);
            return { success: false, message: 'An error occurred during registration' };
        }
    }

    async verifyUser(userData) {
        const connection = await connectionPromise;
        try {
            const sql = 'SELECT parola FROM users WHERE email=?';
            const [result] = await connection.execute(sql, [userData.email]);
            if (result.length > 0 && await bcrypt.compare(userData.parola, result[0].parola)) {
                return { success: true, message: 'User authenticated successfully' };
            }
            return { success: false, message: 'Invalid email or password' };
        } catch (err) {
            console.log(err);
            return { success: false, message: 'An error occurred' };
        }
    }

    async isRegistered(connection, username) {
        const sql = 'SELECT * FROM Users WHERE username=?';
        const [result] = await connection.execute(sql, [username]);
        return result.length > 0;
    }

    async alreadyExists(connection, email) {
        const sql = 'SELECT * FROM Users WHERE email=?';
        const [result] = await connection.execute(sql, [email]);
        return result.length > 0;
    }
}

module.exports = UserModel;
