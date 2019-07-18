const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
   email: {type: String},
   name: {type: String},
   password: {type: String}
});

module.exports = User = mongoose.model('user', UserSchema);