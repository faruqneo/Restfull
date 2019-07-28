const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const graphqlHttp = require('express-graphql');
const PORT = process.env.PORT || 5000;

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/is-auth');

const app = express();

mongoose.connect('mongodb://localhost/graphQL', {useNewUrlParser: true});
let db = mongoose.connection;

//checking for connection
db.once('open', function(req, res){
    console.log("connected with mongodb")
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use((req, res, next) => {
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
   
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);
   
      // Pass to next layer of middleware
      if(req.method === 'OPTIONS')
         return res.sendStatus(200);
      
      next();
});

app.use(auth);

app.use('/graphql', graphqlHttp({
   schema: graphqlSchema,
   rootValue: graphqlResolver,
   graphiql: true,
   formatError(err){
      if(!err.originalError)
         return err;
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return{ message, status: code, data };
   }
}));

//server running
app.listen(PORT, function(){
   console.log(`Server is running on ${PORT}`)
});