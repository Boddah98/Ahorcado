// file system and path libs for manage the words files
const { randomInt } = require('crypto');
const fs = require('fs');
const path = require ('path');
const wordsFilePath = path.join(__dirname,'../../data/words.json');

module.exports = class Controller{
    
    static getWordsSet = async (req, res) => {        
        fs.readFile(wordsFilePath, 'utf8',(err, data)=>{
            if(err){
                console.error('Error de lectura de datos',err);
                return;
            }
            const jsonWordsData = JSON.parse(data);
            const fourWords = this.getWordPack(jsonWordsData);
            return res.send({
                code : 200,
                data : fourWords
            });
        });
    }
    // The list of the words select must not have the same options 
    static getWordPack(jsondata){
        let indexList = [];
        let wordList = [];
        while (indexList.length<4){
            let wordIndex = randomInt(79);
            if(wordIndex in indexList){
                
                continue;
            }else{                
                indexList.push(wordIndex);
                wordList.push(jsondata[wordIndex])
                //console.log("word",jsondata[wordIndex]," added to 4pack. New words list:");
                console.log(wordList);

            }
        }
        
        return wordList;
       
    }
}