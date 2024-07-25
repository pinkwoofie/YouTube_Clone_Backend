//require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDB from "./db/db.js";
import {app} from "./app.js"
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({
    path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env')
})

connectDB()
.then( () => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(` server is running at port : ${process.env.PORT}`);
    })
})
.catch( (err) => {
    console.log("Mongodb db connection failed  !! ", err)
})






























/*
( async () => {
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error", (error) => {
        console.log("ERROR: ", error);
        throw error
       })

       app.listen(process.env.PORT, () => {
        console.log(`App is listening on port ${process.env.PORT}`);
       })

    } catch (error) {
        console.error("ERROR: ", error)
    }
})()
*/