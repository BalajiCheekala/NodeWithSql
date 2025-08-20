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

app.get("/",(req,res)=>{
    res.send("Server is Listening");
});

app.listen(port,()=>{
    console.log("Server is Running");
})

