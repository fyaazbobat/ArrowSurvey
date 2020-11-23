let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let jwt = require('jsonwebtoken');

let passport = require('passport');

// require the users controller for authentication
let indexController = require('../controllers/index');
// require the survey controller 
let surveyController = require('../controllers/survey');

/* GET Route for the survey List page - READ Operation */
router.get('/', surveyController.displaySurvey);

/* GET Route for displaying the createSurvey page */
router.get('/createSurvey',  indexController.RequireAuth, surveyController.DisplayCreateSurveyPage);

// post routr for directing to GotoCreateQuestionPage
router.post('/createSurvey', indexController.RequireAuth, surveyController.GotoCreateQuestionPage);

/* GET Route for displaying the createQuestion page */
router.get('/createQuestion',  surveyController.DisplayCreateQuestion);

/* POST Route for processing the Add page - CREATE Operation */
router.post('/createQuestion', surveyController.CreateSurvey);

// GET Route Display survey page
router.get('/answer/:id', surveyController.DisplayAnswer);

/* POST Route for processing the survey */
router.post('/answer/:id', surveyController.answerSurvey);

/* GET Route for displaying the Edit page - UPDATE Operation */
router.get('/edit/:id', surveyController.displayEditPage);

/* POST Route for processing the Edit page - UPDATE Operation */
router.post('/edit/:id', surveyController.processEditPage);

/* GET to perform  Deletion - DELETE Operation */
router.get('/delete/:id', surveyController.deleteSurvey);

/* GET Route for displaying the createSurvey page */
router.get('/mySurvey',  indexController.RequireAuth, surveyController.displayUserSurvey);

module.exports = router;