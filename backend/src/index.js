import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
    // path: './.env'
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        })
    })
    .catch((err) => {
        console.log("Mongo DB connection failed!!");
    })

//yvEKsleSRLvJQWOb -- db
//3OBrPVVhtCdbJu3g -- db user