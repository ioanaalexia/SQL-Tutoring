const connectionPromise = require('../database');

class QuestionModel{

    constructor(){
       
    }

    async load(cap,userId) {
        const connection = await connectionPromise;
        const sql = `
           SELECT q.question_text 
            FROM questions q
            LEFT JOIN attempts a ON q.question_id = a.question_id WHERE a.user_id = ?
            AND q.category = ? 
            ORDER BY q.difficulty ASC, q.attempts ASC   
            
        `;
        const [result] = await connection.execute(sql, [userId, cap]);
        
        if (result.length > 0) {
            return { success: true, message: result[0].question_text };
        } else {
           return{success:false,message:'No questions found'};
        }
    }

    
    

}

module.exports=QuestionModel;