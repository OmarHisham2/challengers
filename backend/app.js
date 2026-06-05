require("dotenv").config();

const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const matchRoute = require("./routes/match-routes");
const userRoute = require("./routes/user-routes");
const tournamentRoute = require("./routes/tournament-routes");
const playerRoute = require("./routes/player-routes");

const app = express();

const uri = process.env.DB_PATH

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

app.use("/api/users", userRoute);
app.use("/api/matches", matchRoute);
app.use("/api/tournaments", tournamentRoute);
app.use("/api/players", playerRoute);

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
