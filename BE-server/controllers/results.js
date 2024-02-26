
const fs = require('fs');
const path = require ('path');
const resultsFilePath = path.join(__dirname,'../../data/results.json');

module.exports = class Controller{
    
    static getResults = async (req, res) => {        
        fs.readFile(resultsFilePath, 'utf8',(err, data)=>{
            if(err){
                console.error('Error de lectura de datos',err);
                return;
            }
            const jsonResultsData = JSON.parse(data);
            console.log(jsonResultsData);
            return res.send({
                code : 200,
                data : jsonResultsData
            });
        });
    }
    static addResult = async (req,res)=>{
        //Shows the added result
        console.log(req.body)

        fs.readFile(resultsFilePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Error de lectura de datos', err);
              return res.status(500).send({
                code: 500,
                message: 'Error interno del servidor',
              });
            }
            const jsonResultsData = JSON.parse(data);
            
            jsonResultsData.push(req.body)
            fs.writeFile(resultsFilePath,JSON.stringify(jsonResultsData),(err)=>{
                if(err){
                    console.error('Error agregado de datos',err);
                    return;
                }            
            });
           console.log(jsonResultsData)
           return res.status(201).send({
            code: 201,
            message: 'Resultado agregado con éxito',
          });
        });
    }
    
}