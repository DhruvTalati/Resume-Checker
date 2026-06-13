const express = require("express");
const app = express();

/*Require all the routes here*/
const authRouter = require("./routes/auth.routes");

app.use(express.json());

/*Using all the routes here*/
app.use("api/auth", authRouter);

module.exports = app;
