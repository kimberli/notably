var mongoose = require('mongoose');
var Session = require('./Session');

var classSchema = mongoose.Schema({
  class_name: String,
  class_number: Number,
  professor: String,
  description: String,
  sessions: [{type: mongoose.Schema.Types.ObjectId, ref:'Session'}],
});

var Class = mongoose.model('Class', classSchema);

module.exports = Class;