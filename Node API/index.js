const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require('body-parser');
var path = require('path');
dotenv.config();

// connect to db
// mongodb+srv://new_user:new_user@cluster0.lmtkx.mongodb.net/demotest?retryWrites=true&w=majority
// mongodb://localhost:27017/mydb

mongoose.connect(process.env.DB_CONNECT, { 'useNewUrlParser': true, 'useFindAndModify': false, 'useCreateIndex': true, useUnifiedTopology: true }, (err) => {
  // mongoose.connect("mongodb://localhost:27017/mydb", {'useNewUrlParser': true, 'useFindAndModify': false, 'useCreateIndex': true, useUnifiedTopology: true}, (err) => {
  if (err)
    console.log(err);
  else
    console.log('Database Successfull');
});


// import routes
const authRoutes = require("./routes/auth");

// middlewares
app.use(express.json()); // for body parser
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, './public'), { maxAge: 0 }));
app.use(cors());
// Enable pre-flight
app.options("*", cors());

app.use("/api/users", authRoutes);

app.listen((process.env.PORT || 3000), () => console.log("server is running..."));
