let mongoose = require('mongoose');

let Schema = mongoose.Schema;
let question = require('../models/question');

//create survey model class
let surveySchema = mongoose.Schema({
    topic: String,
    user: Schema.Types.ObjectId,
    type:Number,
    questions : { type: Array, default:[]}
},
{
  collection: "surveys"
}
);

//Ready to go
module.exports = mongoose.model('surveys', surveySchema);
