const bcrypt = require('bcrypt');
const User = require('../model/user');

module.exports = {
   createUser: async({ userInput }, req) => {
      
         // const email = UserInputDate.email;
         // const name = UserInputDate.name;
         // const password = UserInputDate.password;
         
         
         const existUser = await User.findOne({email: userInput.email});
         if(existUser){
            const error = new Error('User exists already!');
            throw error;
         }
         const hashedPw = await bcrypt.hash(userInput.password, 12);
         const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw
         });
         const createdUser = await user.save();
         return { ...createdUser._doc, _id: createdUser._id.toString() };
     
   }
};