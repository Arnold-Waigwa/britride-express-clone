import express from "express";
import ridesRouter from "./api/routes/rides";
import registerRouter from "./api/auth/register";
import signInRouter from "./api/auth/sign-in";
import messageRouter from "./api/routes/message";
import passport from "passport";
import { initializePassport } from "./utils";
import googleSignInRouter from "./api/auth/google";

const app = express();
app.use(express.json());

if (!Bun.env.JWT_SECRET) {
  throw new Error("No jwt secret in the environment");
}

if (!Bun.env.GOOGLE_CLIENT_ID || !Bun.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials");
}
initializePassport();
app.use(passport.initialize());
app.use("/api/rides", ridesRouter);
app.use("/api/messages", messageRouter);
app.use("/api/auth/register", registerRouter);
app.use("/api/auth/sign-in", signInRouter);
app.use("/api/auth/google", googleSignInRouter);

app.listen(3000, () => console.log("listening on port 3000"));
