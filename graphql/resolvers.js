const bcrypt = require('bcrypt');
const User = require('../model/user');
const Post = require('../model/post');
const validator = require('validator');
const jwt = require('jsonwebtoken');

module.exports = {
   createUser: async({ userInput }, req) => {
      
         const email = userInput.email;
         const name = userInput.name;
         const password = userInput.password;
         
         const errors = [];

         if(!validator.isEmail(email) || validator.isEmpty(email))
            errors.push({message: 'E-Mail is not valid'});

         if(validator.isEmpty(name))
            errors.push({message: 'Name must be filled'})

         if(validator.isEmpty(password) || !validator.isLength(password, {min: 6, max: 10}))
            errors.push({message: 'Password must be 5 to 10'});

         if(errors.length > 0)
         {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
         }

         const existUser = await User.findOne({email});
         if(existUser){
            const error = new Error('User exists already!');
            throw error;
         }
         const hashedPw = await bcrypt.hash(password, 12);
         const user = new User({
            email,
            name,
            password: hashedPw
         });
         const createdUser = await user.save();
         return { ...createdUser._doc, _id: createdUser._id.toString() };
     
   },
   
   login: async({email, password}) => {
      const user = await User.findOne({email});
      if(!user){
         const error = new Error('User Not Found')
         error.code = 401;
         throw error;
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if(!isEqual){
         const error = new Error('Password is incorrect');
         error.code = 401;
         throw error;
      }
      const token =  jwt.sign({
         userId: user._id.toString(),
         email: user.email,
         name: user.name
      }, 'somesuperscrectkey', {expiresIn: '1h'});
      //console.log(token)
      return { token, userId: user._id.toString() }
   },

   createPost: async({ postInput }, req) => {
      console.log(postInput);
      const title = postInput.title;
      const content = postInput.content;
      const imageURL = postInput.imageURL;
      const creator = postInput.creator;
      //const createdAt = postInput.createdAt;
      //const updatedAt  =postInput.updatedAt;

      const errors = [];
      if(validator.isEmpty(title))
         errors.push({ message: "title is invalid." });
      
      if(validator.isEmpty(content))
         errors.push({ message: 'content is invalid.' });

      if(errors.length > 0)
      {
         const error = new Error('Invalid input.');
         error.data = errors;
         error.code = 422;
         throw error;
      }
     
      const post = new Post({
         title,
         content,
         imageURL
      });

      const createdPost = await post.save();
      // Add post to users' post
      return { 
         ...createdPost._doc,
          _id: createdPost._id.toString(),
           createdAt: post.createdAt.toISOString(), 
           updatedAt: post.updatedAt.toISOString() 
         };
   }
};