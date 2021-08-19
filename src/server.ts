// this file was generated after running the command typeorm init --database postgres

import "reflect-metadata";
import {createConnection} from "typeorm";
import express from 'express'
import morgan from "morgan";

const app = express()

app.use(express.json())
app.use(morgan('dev'))

app.get('/',  (req,res) => {
    res.send("hello world")
})

app.listen(5000, async() => {
    console.log("Server running at http://localhost:5000");
    
    try{
        await createConnection()
        console.log('Database connected');
    } catch(err){
    console.log(err);
    }
})
