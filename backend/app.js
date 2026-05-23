require("dotenv").config();

const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

// const matchRoute = require("./routes/match-routes");
const userRoute = require("./routes/user-routes");
const HttpError = require("./models/http-error");

const app = express();

const uri =
  "mongodb://manu:1KKZyzq7YO0bZDtr@ac-dltubvs-shard-00-00.mnyyadk.mongodb.net:27017,ac-dltubvs-shard-00-01.mnyyadk.mongodb.net:27017,ac-dltubvs-shard-00-02.mnyyadk.mongodb.net:27017/?ssl=true&replicaSet=atlas-glylx8-shard-0&authSource=admin&appName=Cluster0";

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// app.use("/api/matches", matchRoute);
app.use("/api/users", userRoute);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("Successfully connected to MongoDB Cluster!");
    app.listen(5000, () => {
      console.log("Backend server listening on port 5000");
    });
  })
  .catch((err) => {
    console.error("Connection failed:", err);
  });
