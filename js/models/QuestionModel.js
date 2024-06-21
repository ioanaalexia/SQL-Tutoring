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
        const isCorrect = true;
        const insertSql = `INSERT INTO attempts (question_id, user_id, user_answer, is_correct)
                                   VALUES (?, ?, ?, ?)`;
        try {
            
            // Obținerea conexiunii din pool-ul de conexiuni (connectionPromise)
            const connection = await connectionPromise;
    
            // Interogare pentru a obține răspunsul corect pentru întrebare
            const sql = `SELECT correct_answer FROM questions WHERE question_id=?`;
            const [result] = await connection.execute(sql, [questionId]);
            const correctAnswer = result[0].correct_answer;
            
            console.log(answer)
            console.log(correctAnswer)
            if(answer===correctAnswer){

                await connection.execute(insertSql, [questionId, userId, answer, isCorrect]);
                console.log(result[0])
                return true; 
                
            }  
    
            
            try{
               const [results1] = await connection.query(correctAnswer);
               const [results2] = await connection.query(answer);
               // Comparare rezultate
            if (results1[0] && results2[0] && results1[0].correct_answer === results2[0].user_answer) {
               
    
                
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
    
    async addComment(comment,questionId,userId)
    {
        const connection = await connectionPromise;
        console.log("in model")
        try {
                  const sql = `
                    INSERT INTO ratings (question_id, user_id, comment)
                    VALUES (?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    comment = VALUES(comment)
                  `;
                  const [result] = await connection.execute(sql, [questionId, userId, comment]);
                  console.log('Comment inserted or updated:', result);
                  return true;
                } catch (err) {
                  console.error('Error inserting or updating comment:', err.message);
                  return false;
                }
    }

    async addQuestion(capitol,intrebare,dificultate,raspuns,userId)
    {
        const connection = await connectionPromise;
        console.log("in model in add question");

       try{
         const [results, fields] = await connection.execute(raspuns);
        
         try {
            const sql = `
              INSERT INTO questions (category, question_text, correct_answer,difficulty,created_by)
              VALUES (?, ?, ?,?,? )
            `;
            const [result] = await connection.execute(sql, [capitol,intrebare,,raspuns,dificultate,userId]);
            console.log('Interogarea a fost inserata:', result);
            return true;
          } catch (err) {
            console.error('Error inserting or updating comment:', err.message);
            return false;
          }
       }catch (err) {
        console.error('Error in answer:', err.message);
        return false;
      }

        
    }
    
    async verifyCount(userId){
        const connection = await connectionPromise;
        try {
            const sql = `
            SELECT user_id,COUNT(*) as attempt_count
            FROM attempts
            WHERE user_id = ?
            GROUP BY user_id;

            `;

            const [rows] = await connection.execute(sql, [userId]);
            console.log(rows[0])
            if (rows.length > 0) {
            return rows[0].attempt_count;
            } else {
            console.log('No attempts found for this user.');
            return 0;
            }
        } catch (err) {
            console.error('Error getting attempt count:', err.message);
            return null;
        }
          } catch (err) {
            console.error('Error inserting or updating comment:', err.message);
            return false;
          }
}



module.exports=QuestionModel;