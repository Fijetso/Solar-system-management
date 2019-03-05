const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index/home");
const app = express();
///Body-parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
///Passport setup
// app.use(passport.initialize()

///Socket.io setup
const server = require("http").Server(app);
const io = require("socket.io")(server);
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
  socket.on("client-login", function(data) {
    console.log(data);
    ///send data from Server to all of clients
    io.sockets.emit("server-send-data", data + "888");
    ///send back data from Server to the client that have sent to server
    socket.emit("server-send-data", socket.id + " " + data + "888");
    ///send back data from server to every clients except the client that have sent
    socket.broadcast.emit("server-send-data", socket.id + " " + data + "888");
    ///A wants to send data only to B
    ///io.to().emit();
  });
});

app.use("/", indexRouter);

///catch 404 and forward to error handler
app.use("*", function(req, res, next) {
  res.render("error");
  // next(createError(404));
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, process.env.IP, function() {
  console.log("Visit server at: " + process.env.PORT);
});
exports.app = app;
