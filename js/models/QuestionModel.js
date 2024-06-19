const connectionPromise = require('../database');

class QuestionModel{

    constructor(){
       
    }

    async load(cap,userId) {
        const connection = await connectionPromise;
        const sql = `
          SELECT q.question_id, q.question_text
            FROM questions AS q
            LEFT JOIN attempts AS a ON q.question_id = a.question_id AND a.user_id = ?
            WHERE q.category = ?
            AND a.attempt_id IS NULL
            ORDER BY q.difficulty ASC, q.attempts ASC;
        `;
        const [result] = await connection.execute(sql, [userId, cap]);
        
        if (result.length > 0) {
            return { success: true, message: result[0].question_text,questionId:result[0].question_id };
        } else {
           return{success:false,message:'No questions found'};
        }
    }

    async verifyAnswer(answer, questionId, userId) {
        console.log(answer);
        console.log(questionId);
    
        try {
            
            // Obținerea conexiunii din pool-ul de conexiuni (connectionPromise)
            const connection = await connectionPromise;
    
            // Interogare pentru a obține răspunsul corect pentru întrebare
            const sql = `SELECT correct_answer FROM questions WHERE question_id=?`;
            const [result] = await connection.execute(sql, [questionId]);
            const correctAnswer = result[0].correct_answer;
            
            if(answer===correctAnswer){
                const insertSql = `INSERT INTO attempts (question_id, user_id, user_answer, is_correct)
                VALUES (?, ?, ?, ?)`;

                const isCorrect = true;
                await connection.execute(insertSql, [questionId, userId, answer, isCorrect]);
                
                return true; 
                
            }
               
    
            // Verificare răspuns utilizator
            const [results] = await connection.query(correctAnswer);
            try{
               const [results1] = await connection.query(answer);
               // Comparare rezultate
            if (results[0] && results1[0] && results[0].correct_answer === results1[0].user_answer) {
               
    
                
                const insertSql = `INSERT INTO attempts (question_id, user_id, user_answer, is_correct)
                                   VALUES (?, ?, ?, ?)`;
    
                const isCorrect = true;
                await connection.execute(insertSql, [questionId, userId, answer, isCorrect]);
               // await connection.end();
                return true; 
            } else {
                console.log("Răspuns incorect!");
                return false;
            }
    
            // Închidere conexiune
           // Returnează true pentru succes
            }catch(err){
                console.error('Eroare la executarea interogării:', err);
                console.log("eroare")
                return false; // Returnează false în caz de eroare
         }
        
            
        } catch (err) {
            console.error('Eroare la verificarea răspunsului:', err.message);
            return false; // Returnează false pentru eșec
        }
    }
   async sendRating(questionId,userId,dificultate){
        //interogarea in bd
        const connection = await connectionPromise;
        console.log("in model")
        try {
            // Interogare SQL pentru inserarea unui nou rating
            const query = `
              INSERT INTO ratings (question_id, user_id, difficulty_rating)
              VALUES (?, ?, ?)
            `;
        
            // Execută interogarea cu parametrii furnizați
            const [result] = await connection.execute(query, [questionId, userId,dificultate]);
            
            console.log('Rating added successfully:', result);
            return true;
          } catch (error) {
            console.error('Error adding rating:', error);
            return false;
          } 
    }
    

}

module.exports=QuestionModel;