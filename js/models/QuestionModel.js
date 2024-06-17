const connectionPromise = require('../database');
class QuestionModel{

    constructor(){
       
    }

    async load(email,cap){
        //functia care incarca o intrebare
        //intrebarile trebuie sa fie cu cel mai mic numar de atempts,si de la cea mai simpla la cea mai grea
        //select question_text from 
        connection = await connectionPromise;
        const sql ="SELECT question_text FROM questions NATURAL JOIN attempts WHERE category=? ORDER BY difficulty ASC,attempts ASC ";
        const [result] = await connection.execute(sql, [email,cap]);
        console.log(result[0].question_text);
    }

}