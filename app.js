var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const session = require("express-session");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local").Strategy;
var fs = require("fs");
var config = require("./config/keys");
var app = express();
var morgan = require("morgan");
var jwt = require("jsonwebtoken");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/// passport setup
app.use(
  session({ secret: config.passportKey, cookie: { maxAge: 1000 * 60 * config.authenLifeTime } })
);
app.use(passport.initialize());
app.use(passport.session());

/// Body Parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/// JWT setup
app.set("superSecret", config.JWTKey);

/// morgan setup
app.use(morgan("dev"));

/* GET home page. */
app.get("/", function(req, res, next) {
  // res.json({ sucess: true });
  if (req.isAuthenticated()) {
    res.render("index/home");
  } else {
    res.redirect("/login");
  }
});

app
  .route("/login")
  .get(function(req, res, next) {
    // console.log(req.flash("message"));
    if (req.isAuthenticated()) {
      res.redirect("/");
    } else {
      res.render("user/login", { alert: req.session.message || [] });
    }
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
        } else {
          return done(null, false, {
            message: "Incorrect username or password."
          });
        }
      }
    });
  })
);
passport.serializeUser((user, done) => {
  done(null, user.usr);
});
passport.deserializeUser(function(usrname, done) {
  fs.readFile("database/user.json", (err, data) => {
    if (err) {
      return done(err);
    }
    var db = null;
    if (typeof data !== "undefined" && data !== "undefined") {
      db = JSON.parse(data);
      const userRecord = db.find(account => (account.usr = usrname));
      if (userRecord) {
        return done(null, userRecord);
      } else {
        return done(null, false);
      }
    }
  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, process.env.IP, function() {
  console.log("Visit server at: " + process.env.PORT);
});
