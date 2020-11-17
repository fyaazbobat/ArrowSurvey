let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let jwt = require('jsonwebtoken');

let passport = require('passport');

let surveyController = require('../controllers/survey');

/* GET Route for the survey List page - READ Operation */
router.get('/', surveyController.displaySurvey);

/* GET Route for displaying the createSurvey page */
router.get('/createSurvey',  surveyController.DisplayCreateSurveyPage);

// post routr for directing to GotoCreateQuestionPage
router.post('/createSurvey', surveyController.GotoCreateQuestionPage);

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

module.exports = router;