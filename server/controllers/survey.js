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
            displayName: req.user ? req.user.displayName : ''
            });      
        }
    });
}
//Display the create survey page for creating a survey
module.exports.DisplayCreateSurveyPage = (req, res) => {
    res.render('survey/createSurvey', {
        title: "Create Survey",
        surveys: '',
        displayName: req.user.displayName,
        userid: req.user._id
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
        userid: req.user._id,
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
           
            if(type == 1){
                let question = {
                  "questionTopic": req.body['questionTopic' + i],
                  "type": req.body.type
              }
               questionArray.push(question);
             }    
            else if(type == 2){
                if(req.body['questionAns' + i + '3'] != ""){
                   let question = {
                     "questionTopic": req.body['questionTopic' + i],
                     "questionAns":
                     [
                         { "answer": req.body['questionAns' + i + '1'] },
                         { "answer": req.body['questionAns' + i + '2'] },
                         { "answer": req.body['questionAns' + i + '3'] }
                     ],
                     "type": req.body.type
                 }
                  questionArray.push(question);
                }
                else{
                    let question = {
                     "questionTopic": req.body['questionTopic' + i],
                     "questionAns":
                     [
                         { "answer": req.body['questionAns' + i + '1'] },
                         { "answer": req.body['questionAns' + i + '2'] }       
                     ],
                     "type": req.body.type
                 }
                  questionArray.push(question);
                }
                 
            }
         }

        // get a reference to the id from the url
        //let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);
        let newSurvey = Survey({
            "topic": req.body.topic,
            "user": req.user._id,
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

        
        //let id = mongoose.Types.ObjectId(req.params.id);
        try {
            // get a reference to the id from the url
            let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);
    
            // find one survey by its id
            Survey.findById(id, (err, surveyList) => {
                if (err) {
                    console.log(err);
                    res.end(error);
                } else {
                    // show the survey page
                    res.render('survey/answer', {
                        title: surveyList.topic,
                        user: surveyList.user,
                        type: surveyList.questions[0].type,
                        surveyList: surveyList,
                        displayName: req.user ? req.user.displayName : '',
                    });
                }
            });
        } catch (err) {
            console.log(err);
            res.redirect('/errors/404');
        }
    }

// Process the answer survey request
module.exports.answerSurvey = (req, res) => {
    let numberofQuestions = req.body.numberofQuestions;
    let type = req.body.type;
    let questionArray = [];
    for (let i = 0; i < numberofQuestions; ++i) {

        let question = {
            "questionTopic": req.body['questionTopic' + i],
            "questionAns": req.body['question' + i]
        }

        questionArray.push(question);
    }

    let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);
    let newAnswer = answerSchema({
        "surveyID":id,
        "surveyTopic": req.body.surveyTopic,
        "questions": questionArray,
        "type": type
    });
        answerSchema.create(newAnswer, (err, answer) => {
                try {
                    if (err) {
                        console.log(err);
                        res.end(err);
                    } else {
                        res.redirect('/survey');
                    }
                } catch (err) {
                    console.log(err);
                    res.redirect('/errors/404');
                }
            });
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
// Display user surveys list
module.exports.displayUserSurvey = (req, res) => {
    let userId = req.user._id;
     //only show the surveys created by the user
     Survey.find({ user: userId }, (err, surveyList) => {
        if (err) {
            return console.error(err);
        }
        else {
            res.render('survey/userSurvey', {
                title: 'My Surveys',
                surveyList: surveyList,
                displayName: req.user.displayName,
            });
        }
    });
}
