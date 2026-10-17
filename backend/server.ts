import express from "express";
import ridesRouter from "./api/routes/rides";
import registerRouter from "./api/auth/register";

const app = express();
app.use(express.json());

if (!Bun.env.JWT_SECRET) {
  throw new Error("No jwt secret in the environment");
}

app.use("/api/rides", ridesRouter);
app.use("/api/auth/register", registerRouter);

app.listen(3000, () => console.log("listening on port 3000"));
