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
    async addNewUser(userData) {
        userData.user_id = await this.generateUserId();
        const connection = await connectionPromise;

        if (await this.isRegistered(connection, userData.username) || await this.alreadyExists(connection, userData.email)) {
            return { success: false, message: 'Username or email already exists!' };
        }

        try {
            const hashedPass = bcrypt.hashSync(userData.parola, this.saltRounds);
            const values = [userData.user_id, userData.username, userData.email, hashedPass,'student'];
            const sql = 'INSERT INTO `users`(`user_id`, `username`, `email`, `password`,`role`) VALUES (?,?,?,?,?)';
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
            const sql = 'SELECT user_id,username,password,role FROM users WHERE email=?';
            const [result] = await connection.execute(sql, [userData.email]);
            if (result.length > 0 && await bcrypt.compare(userData.parola, result[0].password)) {
                const token = this.authService.generateToken({
                    userId: result[0].user_id,
                    username: result[0].username,
                    email: userData.email
                  });
                if(result[0].role==='admin')
                    return { success: true,token, message: 'Admin authenticated successfully' };
                else 
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

    async findUserById(userId) {
        const connection = await connectionPromise;
        const sql = 'SELECT * FROM users WHERE user_id=?';
        const [result] = await connection.execute(sql, [userId]);
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    }

    async updateUserProfile(userId, profileData) {
    const connection = await connectionPromise;
    let updateFields = [];
    let values = [];
    


    const valuesArray = Object.values(profileData);
    console.log(valuesArray);

    console.log("Starting profile update...");

    console.log(valuesArray[2])
    if (valuesArray[2]) {
        console.log('Updating password:', valuesArray[2]);
        const hashedPass = bcrypt.hashSync(valuesArray[2], this.saltRounds);
        updateFields.push('password = ?');
        values.push(hashedPass);
    }

    // Dacă nu există câmpuri de actualizat, ieșim din funcție
    if (updateFields.length === 0) {
        console.log("No fields to update");
        return false;
    }

    // Adăugăm userId la finalul array-ului de valori pentru condiția WHERE
    values.push(userId);
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;

    try {
        const [result] = await connection.execute(sql, values);
        console.log("Profile updated successfully:", result);
        return true;
    } catch (error) {
        console.error('Error updating user profile:', error);
        return false;
    }
}

}

module.exports = UserModel;