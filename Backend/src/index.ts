import express from 'express';
import { env } from './config/env';
import cors from 'cors';
import userRoute from './routes/userRoute';

import cookieParser from "cookie-parser";

import path from "path";


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // default to local dev
    credentials: true
}));
app.use(cookieParser());

app.get('/check', (req, res) => {
    res.json({
        message: "WellCome to Product Store",
        points: {
            users: "/api/users",
        }
    })
});


app.use("/api/users", userRoute);




/// For frontrend and backend in one link

if (env.NODE_ENV === 'production') {
    const __dirname = path.resolve();

    // server static folder run

    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}



app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
})