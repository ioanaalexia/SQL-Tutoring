
const fs = require('fs');
const fetch = require('node-fetch');
const convert=require("xml-js")

const QuestionModel = require("../models/QuestionModel");

class IEModel{

    constructor(){
       this.questionModel=new QuestionModel();
    }

    async importJson (data) {
        try {
            const questions = JSON.parse(data);
            questions.forEach(async question => {
            const success = await this.questionModel.addQuestion(
                    question.category,
                    question.questionText,
                    question.difficulty,
                    question.correctAnswer,
                    question.createdBy
                );
                if (success) {
                    console.log("Question added successfully.");
                } else {
                    console.log("Failed to add question.");
                    return false
                }
            })
            return true;
        } catch (err) {
           console.log(err);
           return false;
        }
    }

    async importXml (date) {

        const data = {
            questions: {
              questionId: [ /* Array of Objects */ ],
              category: [ /* Array of Objects */ ],
              questionText: [ /* Array of Objects */ ],
              correctAnswer: [ /* Array of Objects */ ],
              difficulty: [ /* Array of Objects */ ],
              createdBy: [ /* Array of Objects */ ],
              attempts: [ /* Array of Objects */ ]
            }
          };
        console.log("in model importXml")
        const options = {compact: true};
        const text = convert.xml2js(date, options);
        const questions=text.questions;
        const numberOfQuestions = questions.questionId.length;

        for (let i = 0; i < numberOfQuestions; i++) {
            for (let i = 0; i < numberOfQuestions; i++) {
                const question = {
                    questionId: questions.questionId[i],
                    category: questions.category[i],
                    questionText: questions.questionText[i],
                    correctAnswer: questions.correctAnswer[i],
                    difficulty: questions.difficulty[i],
                    createdBy: questions.createdBy[i],
                    attempts: questions.attempts[i]
                };
        
        
                    const success = await this.questionModel.addQuestion(
                    question.category._text,
                    question.questionText._text,
                    question.difficulty._text,
                    question.correctAnswer._text,
                    question.createdBy._text
                );
               
                if (success) {
                    console.log("Question added successfully.");
                } else {
                    console.log("Failed to add question.");
                    return false;
                }
            }

        }
            return true;
       
       
    }
}

module.exports=IEModel;