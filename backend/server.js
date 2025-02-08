import express from 'express';
import cors from 'cors'; 
import dotenv from 'dotenv'
import connectDb from './db/connectDb.js';
dotenv.config();
const app = express(); 
app.use(express.json());
import leaseRouter from "./route/leaseRoute.js";
// import rentRouter from './routes/rentRouter.js';
app.use('/lease',leaseRouter);
// app.use('/rent',rentRouter);
 app.use(cors()); 
 
 connectDb();  
 
const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log("Server connected to : "+PORT);
})