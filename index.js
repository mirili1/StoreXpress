import express from "express";
import { config } from "dotenv";
import {connectToDB} from "./config/dbConfig.js"
import morgan from "morgan";
import errorHandler from "./controllers/errorHandler.js";
import cors from 'cors';
import productRouter from './routes/product.js'
import userRouter from './routes/user.js'
import orderRouter from './routes/order.js'
config();
connectToDB()
const app=express();
// app.use(cors({ origin: "http://localhost:6000" }));
app.use(cors({ origin: '*' }));
app.use(morgan("common"));
app.use(express.json());
app.use(express.static('images'));
app.use("/api/product",productRouter);
app.use("/api/user",userRouter);
app.use("/api/order",orderRouter);
app.use(errorHandler)
let port=process.env.PORT||6000
app.listen(port,()=>{console.log("listening on port "+port);})