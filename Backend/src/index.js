import express from 'express'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();
dotenv.config();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
// store static file like images / favicon-icon etc..
app.use(express.static("public"));
// set cookies on browser / server : 
app.use(cookieParser());

const port = process.env.PORT || 4000;
app.get('/', (req, res) => {
    res.send("Hello wolrd");
});

mongoose.connect(`${process.env.MONGO_URL}Inventory-Managment`)
    .then(() => {
        console.log("Database connected successfully");
        app.listen(port, () => {
            console.log(`Server connect at ${port}`);
        })
    })
    .catch(() => {
        console.log("Database connection failed!");
    })

