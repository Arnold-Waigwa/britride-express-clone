import express from "express";
import ridesRouter from "./api/rides";

const app = express();
app.use(express.json());

app.use("/api/rides", ridesRouter);

app.listen(3000, () => console.log("listening on port 3000"));
