const IEModel = require("../models/IEModel");
const QuestionModel = require("../models/QuestionModel");
const BaseController = require("./BaseController");
const querystring = require('querystring');
const url = require('url');
const fs=require('fs');
const json2xml = require('json2xml');
const path=require('path')
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });



class IEController extends BaseController {

    constructor() {
        super();
        this.ieModel = new IEModel();
        this.questionModel = new QuestionModel();
    }

    async import(req,res){
       
        upload.single('file')(req, res, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error uploading file');
                return;
            }
            
            const filePath = req.file.path;
            const fileType = req.file.mimetype;
            
            console.log(fileType)
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error reading file');
                    return;
                }
                
                if (fileType === 'application/json') {
                    const result=this.ieModel.importJson(data);
                    if(result)
                        {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true, message: "corect" }));
                        }
                        else{
                            res.writeHead(400, { 'Content-Type': 'text/plain' });
                            res.end('Invalid JSON format');
                        }
                } else if (fileType === 'text/xml') {
                    const result=this.ieModel.importXml(data);
                    if(result)
                        {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true, message: "corect" }));
                             }else{
                            res.writeHead(406, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: "Nu s-a putut face inserarea intrebarilor"}));
                        }
                } else {
                    res.writeHead(406, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: "Unsupported file type"}));
                }

                // Clean up the uploaded file after processing
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
        });
    } 
    
    async exportJson(req,res){
        const questions=await this.questionModel.getQueries();
        const jsonContent = JSON.stringify(questions, null, 2);
        const filePath = path.join(__dirname, 'questions.json');

        fs.writeFile(filePath, jsonContent, 'utf8', (err) => {
            if (err) {
                console.error('An error occurred while writing JSON Object to File:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('An error occurred while writing JSON Object to File.');
                return;
            }

            res.setHeader('Content-Disposition', 'attachment; filename="questions.json"');
            res.setHeader('Content-Type', 'application/json');
            fs.createReadStream(filePath).pipe(res);
        });
    } 

    async exportXml(req, res) {
        const questions=await this.questionModel.getQueries();
        const xmlContent = json2xml({ questions: questions });
        const filePath = path.join(__dirname, 'questions.xml');

        // Write XML content to a file
        fs.writeFile(filePath, xmlContent, 'utf8', (err) => {
            if (err) {
                console.error('An error occurred while writing XML Object to File:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('An error occurred while writing XML Object to File.');
                return;
            }

            // Set headers to force download
            res.setHeader('Content-Disposition', 'attachment; filename="questions.xml"');
            res.setHeader('Content-Type', 'application/xml');

            // Create a read stream and pipe it to the response
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(res);
        });
    }
}





module.exports=IEController;