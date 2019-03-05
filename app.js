var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var fs = require("fs");
var keys = require("./config/keys");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/// passport setup
app.use(session({ secret: keys.passportKey }));
app.use(passport.initialize());
app.use(passport.session());

/* GET home page. */
app.get("/", function(req, res, next) {
  res.render("index/home");
});

app
  .route("/login")
  .get(function(req, res, next) {
    res.render("user/login");
  })
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/"
    })
  );
passport.use(
  new LocalStrategy((username, password, done) => {
    fs.readFile("database/user.json", (err, data) => {
      if (err) {
        return done(err);
      }
      var db = null;
      if (typeof data !== "undefined" && data !== "undefined") {
        db = JSON.parse(data);
        const userRecord = db.find(account => account.usr == username);
        if (userRecord && userRecord.pwd == password) {
          return done(null, userRecord);
        }
      } else {
        return done(null, false, {
          message: "Incorrect username or password."
        });
      }
    });
  })
);
passport.serializeUser((user, done) => {
  done(null, user.usr);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, process.env.IP, function() {
  console.log("Visit server at: " + process.env.PORT);
});
