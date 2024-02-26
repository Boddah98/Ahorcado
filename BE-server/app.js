// server object for backend
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
//Port define
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Words data methods and const

const wordsController = require('./controllers/words');
app.get("/getWordSet",wordsController.getWordsSet);
const resultsController = require('./controllers/results');
app.get("/getResults",resultsController.getResults);

app.post("/addResult",resultsController.addResult);


/* Controllers for api calls
const questionController = require('./controllers/questions');

file system module, decode type and request function 
app.get("/getQuestionSet",questionController.getQuestionSet);
*/


module.exports = app;