var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var Router = require("./routes/router");

var app = express();

var mongoURL =
  "mongodb+srv://admin:admin@cartservice.flj0m.mongodb.net/?retryWrites=true&w=majority";
const options = {
  dbName: "cart",
};
mongoose.connect(mongoURL, options);
var db = mongoose.connection;

db.on("connected", () => console.log("MongoDB connected successfully"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", Router);

//catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.send("");
//   // res.render("error");
// });

module.exports = app;
