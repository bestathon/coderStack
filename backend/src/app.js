import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))    // express.urlencoded()
app.use(express.static("public"))
app.use(cookieParser())

//routes

import userRouter from "./routes/user.routes.js";
import cardRouter from "./routes/card.routes.js";
import likeRouter from "./routes/like.routes.js";

app.get("/", (req, res) => res.send("Backend of frontend"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/cards", cardRouter);
app.use("/api/v1/likes", likeRouter);

export { app };
