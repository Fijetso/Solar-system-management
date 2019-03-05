const express = require("express");
const app = express();
var router = express.Router();
// var main = require("../../app");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
var passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const fs = require("fs");
///Cookie-parser setup
app.use(cookieParser());
///Body-parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
///Passport setup
const mySecret = require("../../config/keys").passportSecret;
app.use(session({ secret: mySecret, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index/home.ejs");
});

router
  .route("/login")
  .get(function(req, res, next) {
    res.render("user/login.ejs");
  })
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      successRedirect: "/loginOK",
      failureFlash: "Invalid username or password."
    })
  );
router.get("/loginOK", (req, res, next) => {
  res.send("Login success");
});

passport.use(
  new LocalStrategy((username, password, done) => {
    fs.readFile("./database/userdb.json", (err, data) => {
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

module.exports = router;
