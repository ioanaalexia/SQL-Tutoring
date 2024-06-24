const { connectionPromise} = require('../database');

class AdminModel{

    constructor(){
       
    }
    async getUserScores() {
        const connection = await connectionPromise;
        const query = `
            SELECT u.username, 
                   (SELECT COUNT(*) FROM attempts WHERE user_id = u.user_id AND is_correct = TRUE) AS scor
            FROM users u
            WHERE u.role = 'student'
            ORDER BY scor DESC
        `;
        const [results] = await connection.execute(query);
        console.log("Acesta este clasamentul: ", results);
        return results;
    }
}

module.exports=AdminModel;