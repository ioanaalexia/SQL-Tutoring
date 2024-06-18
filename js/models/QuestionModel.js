const connectionPromise = require('../database');

class QuestionModel{

    constructor(){
       
    }

    async load(cap,userId) {
        const connection = await connectionPromise;
        const sql = `
           SELECT q.question_id,q.question_text 
            FROM questions q
            LEFT JOIN attempts a ON q.question_id = a.question_id WHERE a.user_id != ?
            AND q.category = ? 
            ORDER BY q.difficulty ASC, q.attempts ASC   
            
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
    
            console.log('Răspunsul corect:', correctAnswer);
    
            // Verificare răspuns utilizator
            const [results] = await connection.query(correctAnswer);
            try{
               const [results1] = await connection.query(answer);
               // Comparare rezultate
            if (results[0] && results1[0] && results[0].correct_answer === results1[0].user_answer) {
                console.log("Răspuns corect!");
    
                // Înregistrare în baza de date (tabela attempts)
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
    
    

}

module.exports=QuestionModel;