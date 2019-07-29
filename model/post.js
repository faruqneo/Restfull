const mongoose = require('mongoose');
const User = require('./user');

const PostSchema = ({
   title: {type: String},
   content: {type: String},
   imageURL: {type: String},
   creator: {type: mongoose.Schema.Types.ObjectId, ref: User},
   createdAt: {type: Date, default: Date.now()},
   updatedAt: {type: Date, default: Date.now()}
});

module.exports = Post = mongoose.model('post', PostSchema);