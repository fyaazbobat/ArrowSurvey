let mongoose = require('mongoose');

let resultSchema = mongoose.Schema({
  survey: { type: Schema.ObjectId, required:true, ref: 'Survey' },
  question: {type:Schema.ObjectId,required: true},
  choices:[ {type:Schema.ObjectId,required: true} ],
});

module.exports=mongoose.model('Result',resultSchema);