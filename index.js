const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 8080;
const methodOverride = require("method-override");





const path = require("path");
const {v4:uuidv4} = require("uuid");
const { createConnection } = require('net');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public"))); 
app.use(express.urlencoded({extended:true}));
app.use(express.json());


// Creating Connection


const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'project',
    password:"cheeks"
});
let getRandomUser=()=> {
  return [
    faker.string.uuid(),
    faker.internet.username(), 
    faker.internet.email(),
    faker.internet.password(),
  ];
}


//Creating Table


// let q1 = "create table users(id varchar(40) primary key,username varchar(40) unique,email varchar(40) unique not null,password varchar(40) not null)"

// let q1 = "desc users";
// connection.query(q1,(err,result)=>{
//     if(err)console.log(err);
//     console.log(result);
// })


//Insert Data into DataBase

// let values = [];
// for(let i = 1;i<=200;i++){
//     let data = getRandomUser();
//     values.push(data);
// }

// let q2 = "insert into users values ?";
//     connection.query(q2,[values],(err,result)=>{
//         if(err)console.log(err);
//         console.log("Insertion Successful");
//     })



// users Database

app.get("/users",(req,res)=>{
    let q = "select * from users";
    connection.query(q,(err,result)=>{
        if(err){
            console.log(err);
            res.send("Some Error in DataBase");
        }
        res.render("users.ejs",{result});
    })
    
});

// Total Number of users

app.get("/", (req, res) => {
    let q1 = "SELECT COUNT(*) AS count FROM users";
    connection.query(q1, (err, result) => {
        if (err) {
            console.log(err);
            res.redirect("error.ejs");
        }
        let data = result[0].count.toString();
        res.render("home.ejs",{data});
    });
});


//forgot Password rendering

app.get("/users/forgotPassword",(req,res)=>{
    res.render("forgotPassword.ejs")
})


//Email Verification
app.get("/users/passwordChange/",(req,res)=>{
    let {email : formEmail} = req.query;
    let q1 = "select * from users where email = ?";
    connection.query(q1,[formEmail],(err,result)=>{
        if(err){
            console.log(err);
            return res.render("error.ejs");
    
        }
        
        if(result.length >0){
            let data = result[0];
            res.render("changePassword.ejs",{data});
        }else{
            res.send("Enter Valid email");          
        }
        
    });
});

//update Password
app.post("/users/updatePassword", (req, res) => {
    let { email: formEmail, newPassword: formNewPassword, confirmPassword: formConfirmPassword } = req.body;

    if (formNewPassword !== formConfirmPassword) {
        console.log("Password mismatch");
        return res.redirect("/users/passwordChange"); 
    }

    let q1 = "UPDATE users SET password = ? WHERE email = ?";
    connection.query(q1, [formNewPassword, formEmail], (err, result) => {
        if (err) {
            console.log(err);
            return res.render("error.ejs");
        }
        res.send("Password Updated");
    });
});


//get user Details


app.get("/users/userdetails",(req,res)=>{
    let {email : formEmail,password : formPassword} = req.query;
    let q1 = "select * from users where email = ?";
    connection.query(q1,[formEmail],(err,result)=>{
        if(err){
            console.log(err);
            res.render("error.ejs");
        }
        if(result.length > 0){
            let data = result[0];
            let dbPassword = data.password;
            if(dbPassword != formPassword){
                res.render("wrongPassword.ejs");
            }else{
                res.render("userDetails.ejs",{data});
            }
        }else{
            res.render("noUser.ejs");
        }

    });
});

// sign up

app.get("/users/signup",(req,res)=>{
    res.render("newUser.ejs");
})


//adding new user into Database


app.post("/users/newuser",(req,res)=>{
    let id = uuidv4();
    let {username : formUsername,email : formEmail,password:formPassword,confirmPassword:formConfirmPassword}=req.body;
    if(formPassword != formConfirmPassword){
        console.log("Password MisMatches");
        res.redirect("/users/signup");
    }else{
        let q1 = "insert into users values(?,?,?,?)";
        connection.query(q1,[id,formUsername,formEmail,formPassword]);
        res.send("Sign Up SuccessFull");
    }
})









app.listen(port,()=>{
    console.log("Server is Running");
})

