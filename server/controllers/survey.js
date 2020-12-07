let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let jwt = require('jsonwebtoken');

// create a reference to the model
let Survey = require('../models/survey');
let answerSchema = require('../models/answers');
let schema = require('../models/result')();


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
            {title: 'surveyList', 
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
        surveyList: '',
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
        surveyList: '',
        numberOfQuestion: parseInt(numberOfQuestion),
        userid: req.user._id,
        topic: topic,
        type: type
    });
}

//create surveyList with questions
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
                console.log(req.body);
                console.log(newSurvey.questions[0]);
                console.log(questionArray);
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
    let numberofQuestion = req.body.numberofQuestions;
    console.log("numberofQuestion");
    console.log(numberofQuestion);
    let type = req.body.type;
    let questionArray = [];
    for (let i = 0; i < numberofQuestion; ++i) {

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
        "user": req.body.userId,
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
    let query = require('url').parse(req.url, true).query;
    //let numberOfQuestion = req.params.numberOfQuestion; why?

    let topic = query.topic;
    let numberOfQuestion = query.numberOfQuestion;
    let type = query.type;

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
                title: surveyList.topic,
                user: surveyList.user,
                type: type,
                numberOfQuestion: parseInt(numberOfQuestion),
                surveyList: surveyList,
                displayName: req.user ? req.user.displayName : '',
            });

        }
    });
}
//process edit
module.exports.processEditPage = (req, res, next) => {

    let id = mongoose.Types.ObjectId(req.params.id);
    let numberOfQuestion = req.body.numberOfQuestion;
    let questionArray = [];
    let type = req.body.type;
    
    for (var i = 1; i < numberOfQuestion; ++i) {

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
         }
        }
    let surveyList = Survey({
        "_id": id,
        "topic": req.body.topic,
        "type": type,
        "questions":questionArray
        
    });

    Survey.updateOne({_id: id}, surveyList, (err) => {
        if(err)
        {
            
            console.log(err);
            res.end(err);
        }
        else
        {
            console.log(req.body);
            console.log(questionArray);
            
            console.log(surveyList.questions[0]);

         res.redirect('/survey');


        }
    });
}
// Display user surveyList list
module.exports.displayUserSurvey = (req, res) => {
    let userId = req.user._id;
     //only show the surveyList created by the user
     Survey.find({ user: userId }, (err, surveyList) => {
        if (err) {
            return console.error(err);
        }
        else {
            res.render('survey/userSurvey', {
                title: 'My surveyList',
                surveyList: surveyList,
                displayName: req.user.displayName,
            });

        }
    });
}

// Display Result
module.exports.displayResult = (req, res, next) => {

        // get a reference to the id from the url
        let id = mongoose.Types.ObjectId.createFromHexString(req.params.id);

        Survey.find({_id: id}, (err,surveyList) => {
          if(err) {
            console.log(err);
            res.end(err);
          } else {
              console.log("dis playResult called."),
              answerSchema.find({"surveyID":id},(err,answers)=>{
                if(err) {
                     console.log(err);
                     res.end(err);
                 } else {
                     try{
                            let respondents = answers.length;
                            if(respondents==0)
                            {
                                throw "no respondents yet.";
                            }                        
                                console.log("respondents");
                                console.log(respondents);
    
                                let numberOfQuestion = answers[0].questions.length;
                                console.log("numberOfQuestion");
                                console.log(numberOfQuestion);
                                let result_ = {}
                                for(let count = 0;count<numberOfQuestion;count++)
                                {
                                    let singleResult = {};
                                    let type = surveyList[0].type;
                                    singleResult['type'] = type;
                                    singleResult['total'] = 0;
                                    if(type === 2)
                                        {
                                        let ans0 = surveyList[0].questions[count].questionAns[0];
                                        //console.log(ans0);
                                        let ans1 = surveyList[0].questions[count].questionAns[1];
                                        //console.log(ans1);
                                        let ans2 = surveyList[0].questions[count].questionAns[2];
                                        
                                        singleResult["topic"] = surveyList[0].questions[count].questionTopic;
                                        singleResult[ans0['answer']] = 0;
                                        singleResult[ans1['answer']] = 0;
                                        singleResult[ans2['answer']] = 0;
                                        for(let i=0;i<respondents;i++){
                                        let answer = answers[i].questions[count].questionAns;
                                        console.log(answer);
                                        switch(answer) {
                                            case ans0['answer']:
                                                singleResult[ans0['answer']]++;
                                            break;
                                            case ans1['answer']:
                                                singleResult[ans1['answer']]++;
                                            break;
                                            case ans2['answer']:
                                                singleResult[ans2['answer']]++;
                                            break;
                                            default:
                                                { }
                                            }
                                          }   
    
                                        }

                                       
                                   //end of if block
    
                        result_[count] = singleResult;
    
                     }
                     console.log("result_!!!!!!!!!!!!");
                      console.log(result_);
                      schema.Results.remove({"surveyID":id},(err,results)=>{});
    
                      let newResult = new schema.Results({
                          "surveyID":id,
                          "createDate":Date.now
                      });
                      console.log("newResult");
                      console.log(newResult);
                      let keys = Object.keys(result_);
                      for(let count = 0;count<keys.length;count++)
                      {
                          let quetionTopic = result_[keys[count]]['topic'];
                          console.log(quetionTopic);
                          let singleResult = result_[keys[count]];
                          let keys_ = Object.keys(singleResult);
                          let type = result_[keys[count]]['type'];
                          let total = 0;

                         total = singleResult[keys_[3]]+singleResult[keys_[4]]+singleResult[keys_[5]];

                          result_[keys[count]]['total'] = total;
    
                          let newSingleResult = new schema.SingleResult({
                              "questionTopic":quetionTopic,
                              "ans":{
                                  "a1":keys_[3],
                                  "a1result":singleResult[keys_[3]],
                                   "a2":keys_[4],
                                  "a2result":singleResult[keys_[4]],
                                   "a3":keys_[5],
                                  "a3result":singleResult[keys_[5]],
                                  "total":total
                              }
    
                          });
                          //console.log(newSingleResult);
                          newResult.answers.push(newSingleResult);
    
                      }
                      console.log(newResult);
                       console.log("saved the new result.");
                      schema.Results.create(newResult, (err, survey) => {
                            if(err) {
                            console.log(err);
                             res.end(err);
                            } else {
                                console.log("result_");
                                console.log(result_);
                             res.render('survey/result', {
                                 title: "view result",
                                 surveyID:id,
                                 result: result_,
                                 displayName: req.user.displayName
                            });
                             }
                            });
                     }
                     catch(err){
                        let userId = req.user._id;
                        //only show the surveyList created by the user
                         Survey.find({ user: userId }, (err, surveyList) => {
                        if (err) {
                            return console.error(err);
                        }
                        else
                        {
                         res.redirect('/survey/mySurvey');
                             
                        }
                    });
                }
              }
    
              });
          }
        });
    }