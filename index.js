const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const graphqlHttp = require('express-graphql');
const PORT = process.env.PORT || 3000;

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

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

app.use('/graphql', graphqlHttp({
   schema: graphqlSchema,
   rootValue: graphqlResolver,
   graphiql: true
}));

//server running
app.listen(PORT, function(){
   console.log(`Server is running on ${PORT}`)
});