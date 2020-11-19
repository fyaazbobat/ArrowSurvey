let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let jwt = require('jsonwebtoken');

// create a reference to the model
let Survey = require('../models/survey');
let answerSchema = require('../models/answers');


module.exports.displaySurvey = (req, res, next) => {
    Survey.find((err, surveyList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            //console.log(SurveyList);

            res.render('survey/list', 
            {title: 'Surveys', 
            surveyList: surveyList, 
            });      
        }
    });
}
//Display the create curvey page for creating a survey
module.exports.DisplayCreateSurveyPage = (req, res) => {
    res.render('survey/createSurvey', {
        title: "Create Survey",
        surveys: ''
    });
}

//go to create questions page
module.exports.GotoCreateQuestionPage = (req, res) => {
    //
    console.log(req.body.numberOfQuestion);
    console.log(req.body.topic);

    console.log(req.body.type);
    let numberOfQuestion = parseInt(req.body.numberOfQuestion)
    //redirect params to create page
    res.redirect('/survey/createQuestion/' + '?topic=' + req.body.topic + '&type=' + req.body.type + '&numberOfQuestion=' + numberOfQuestion);
}

// Display create questions ejs page
module.exports.DisplayCreateQuestion = (req, res) => {

    let query = require('url').parse(req.url, true).query;
    //let numberOfQuestion = req.params.numberOfQuestion; why?

    let topic = query.topic;
    let numberOfQuestion = query.numberOfQuestion;
    let type = query.type;

    res.render('survey/createQuestion', {
        title: "Create Survey",
        surveys: '',
        numberOfQuestion: parseInt(numberOfQuestion),
        topic: topic,
        type: type
    });
}

//create surveys with questions
module.exports.CreateSurvey = (req, res) => {

        //create question objects
        let numberOfQuestion = req.body.numberOfQuestion;
        let questionArray = [];
        let type = req.body.type;

        //create questions accorder to the numberOfQuestion
        for (var i = 1; i <= numberOfQuestion; ++i) {
           
                   let question = {
                     "questionTopic": req.body['questionTopic'+ i],
                     "type": req.body.type
                 }
                  questionArray.push(question);
            }    
         


        // get a reference to the id from the url
        //let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);
        let newSurvey = Survey({
            "topic": req.body.topic,
            "type":type,
            "questions": questionArray

        });
        
        Survey.create(newSurvey, (err, survey) => {
            if (err) {
                console.log(err);
                res.end(err);
            } else {
                res.redirect('/survey');
            }
        });
}
//display survey
module.exports.DisplayAnswer = (req, res) => {

        // get a reference to the id from the url
        //let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);
        let id = mongoose.Types.ObjectId(req.params.id);
        
        // find one survey by its id
        Survey.findById(id, (err, surveyList) => {
                // show the survey page
                
                res.render('survey/answer', {
                    title: surveyList.topic,
                    type: surveyList.questions[0].type,
                    surveyList: surveyList,
                });
            
        });
    
}

// Process the answer survey request
module.exports.answerSurvey = (req, res) => {
    let numberofQuestions = req.body.numberofQuestions;

    let questionArray = [];
    for (let i = 0; i < numberofQuestions; ++i) {

        let question = {
            "questionTopic": req.body['questionTopic' + i],
            "questionAns": req.body['question' + i]
        }

        questionArray.push(question);
    }

    let id = mongoose.Types.ObjectId(req.params.id);
    let newAnswer = answerSchema({
        "surveyID":id,
        "surveyTopic": req.body.surveyTopic,
        "questions": questionArray,
        "type": surveyList.questions[0].type
    });
            if (err) {
                console.log(err);
                res.end(err);
            } else {
                res.redirect('/survey');
            }
}

// Delete the survey
module.exports.deleteSurvey = (req, res, next) => {
    let id = mongoose.Types.ObjectId(req.params.id);

    Survey.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
             // refresh the book list
             res.redirect('/survey');
        }
    });
}

//Display edit
    module.exports.displayEditPage = (req, res, next) => {

    let id = mongoose.Types.ObjectId(req.params.id);


    Survey.findById(id, (err, surveyList) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('survey/edit', {title: 'Edit survey',
                surveyList: surveyList
            });
            console.log(surveyList.questions);
        }
    });
}
//process edit
module.exports.processEditPage = (req, res, next) => {
    let id = mongoose.Types.ObjectId(req.params.id);
    //create question objects
    let numberofQuestions = req.body.numberofQuestions;
    let questionArray = [];
    let type = req.body.type;
    
    for (var i = 0; i < numberofQuestions; ++i) {

        let question = {
            "questionTopic": req.body['questionTopic' + i],
            "type": type
        }
        questionArray.push(question);
    }

    let surveyList = Survey({
        "_id": id,
        "topic": req.body.topic,
        "questions" :questionArray,
        "type": type
    });

    Survey.updateOne({_id: id}, surveyList, (err) => {
        if(err)
        {
            
            console.log(err);
            res.end(err);
        }
        else
        {
         res.redirect('/survey');
        }
    });
}