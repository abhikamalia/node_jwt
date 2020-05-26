const router = require('express').Router();
const mysqlDB = require('../mysqlDB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { registerValidation , loginValidation } = require('../validation');
let mySqlConnection = mysqlDB();
let urlencodedParser = bodyParser.urlencoded({extended : false});



let mysqlConnection = mysqlDB();

router.post('/register' , urlencodedParser , (req , res) => {
    console.log(req.body)
    const Users = [];
    //validation
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user is already in the database
    let query2 = 'SELECT * FROM user';
    mysqlConnection.query(query2 ,  async (err , rows , fields) => {
        let emailExist = false;
        if(!err){
            for(let i = 0 ; i < rows.length ; i++){
               if(rows[i].email == req.body.email){
                   emailExist = true;
                   return res.status(400).send('Email already exist');
               }
            }
            if(!emailExist){
                try{
                    //encrypt password by adding a salt
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(req.body.password , salt);
                    let query = 'INSERT INTO user(name , email , password) VALUES(? , ? , ?)';
                    mysqlConnection.query(query , [req.body.name , req.body.email , hashedPassword] , (err , rows , fields) => {
                        if(!err) {
                         
                            res.send(rows)
                        }
                        else console.log(err);
                    });
                }catch{
                    res.status(400).send(err);
                }
            }
            console.log('working...');
        }
        else console.log(err);
    });

   
});

router.post('/login' , (req , res) => {
    console.log(req.body);
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let query2 = 'SELECT * FROM user';
    mysqlConnection.query(query2 ,  async function(err , rows , fields){
      
        if(!err){
            let emailCheck = false;
            console.log(rows);
            for(let i = 0 ; i < rows.length ; i++){
                console.log(rows[i].email);
               if(rows[i].email == req.body.email){
                   emailCheck = true;
                   //password check
                   const validPassword = await bcrypt.compare(req.body.password , rows[i].password);
                   if(!validPassword) return res.status(400).send('Password is wrong...');

                   //create and assigne a token
                   const token = jwt.sign({id: rows[i].name} , process.env.TOKEN_SECRET);
                   res.header('auth-token' , token).send(token);
                //    res.send('Logged in !');
               }
            }
            if(!emailCheck){
                //email check
                return res.status(400).send('Email doesnt exit..');
            }
        }
        else console.log(err);
    });

});

module.exports = router;