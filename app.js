var express = require("express");
var path = require("path");
var indexRouter = require("./routes/index/home");
var app = express();

///Socket.io setup
var server = require("http").Server(app);
var io = require("socket.io")(server);
///view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

///Listen to socket.io
io.on("connection", function(socket) {
  console.log("Da ket noi " + socket.id);
  socket.on("disconnect", function() {
    console.log(socket.id + " da ngat ket noi");
  });
});

app.use("/", indexRouter);

///catch 404 and forward to error handler
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

server.listen(3000, process.env.IP, function() {
  console.log("Visit server at: " + process.env.PORT);
});
