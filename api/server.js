import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import axios from "axios";
import nodemailer from "nodemailer";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const mongoUri = "mongodb+srv://kanhchana:<db_password>@cluster0.v8dud5t.mongodb.net/";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
    process.exit(1);
  });

app.listen(port, () => {
  console.log("Server running");
});
