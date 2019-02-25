var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index/home.ejs");
});

router.get("/login", function(req, res, next) {
  res.render("user/login.ejs");
});

module.exports = router;
