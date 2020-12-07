let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let jwt = require('jsonwebtoken');

let passport = require('passport');

function requireAuth(req,res,next)
{
	if(!req.isAuthenticated())
	{
		return res.redirect('/login')
	}
	next();
}

// require the users controller for authentication
let indexController = require('../controllers/index');
// require the survey controller 
let surveyController = require('../controllers/survey');

/* GET Route for the survey List page - READ Operation */
router.get('/', surveyController.displaySurvey);

/* GET Route for displaying the createSurvey page */
router.get('/createSurvey',requireAuth,  indexController.RequireAuth, surveyController.DisplayCreateSurveyPage);

// post routr for directing to GotoCreateQuestionPage
router.post('/createSurvey', requireAuth, indexController.RequireAuth, surveyController.GotoCreateQuestionPage);

/* GET Route for displaying the createQuestion page */
router.get('/createQuestion', requireAuth, surveyController.DisplayCreateQuestion);

/* POST Route for processing the Add page - CREATE Operation */
router.post('/createQuestion',requireAuth, surveyController.CreateSurvey);

// GET Route Display survey page
router.get('/answer/:id', surveyController.DisplayAnswer);

/* POST Route for processing the survey */
router.post('/answer/:id',surveyController.answerSurvey);

/* GET Route for displaying the Edit page - UPDATE Operation */
router.get('/edit/:id',requireAuth, surveyController.displayEditPage);

/* POST Route for processing the Edit page - UPDATE Operation */
router.post('/edit/:id',requireAuth, surveyController.processEditPage);

/* GET to perform  Deletion - DELETE Operation */
router.get('/delete/:id', requireAuth,surveyController.deleteSurvey);

/* GET Route for displaying the createSurvey page */
router.get('/mySurvey/',  requireAuth, indexController.RequireAuth, surveyController.displayUserSurvey);

/* GET Route for displaying the createSurvey page */
router.get('/result/:id',  requireAuth, indexController.RequireAuth, surveyController.displayResult);


module.exports = router;