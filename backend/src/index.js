import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({
    path: './env'
    // path: './.env'
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port ${process.env.PORT || 8000}`);
})
