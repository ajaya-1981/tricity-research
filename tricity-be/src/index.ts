import express from "express";
import session from "express-session";
import passport from "./config/passport";
import mongoose from "mongoose";
import authRouter from "./router/auth";
import Redis from "ioredis";
import { RedisStore } from "connect-redis";
import cors from "cors";

const app = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);
const redisClient = new Redis(process.env.REDIS_URL || "");

mongoose.connect(process.env.MONGODB_URI || "");

app.use(
  cors({
    origin: `http://${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.COOKIE_SECRET || "",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set to true in production (with HTTPS)
      sameSite: "lax", // or 'none' if using cross-site cookies
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
