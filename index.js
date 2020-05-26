const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mysql = require('./mysqlDB');
const app = express();

dotenv.config();

app.use(bodyParser.json());

//import route
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

//database connection
let mysqlConnection = mysql();

mysqlConnection.connect(function(err){
    if(!err) console.log('Database connected..');
    else console.log(err);
});
//route middlewares
app.use('/api/user' , authRoute); //this means whatever request we have in authRoute it will all start with /api/user
app.use('/api/posts' , postsRoute);

app.listen(3000 , () => console.log('Server running...'));