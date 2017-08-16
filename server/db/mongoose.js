var mongoose = require('mongoose');

const db = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect( db || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};
