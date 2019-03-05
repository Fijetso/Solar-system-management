///Call server
var socket = io("http://localhost:3000");

$(document).ready(function() {
  $("#request-login").click(function() {
    socket.emit("client-login", "Hello from client");
  });
});
///on listen server-send-data
socket.on("server-send-data", function(data) {
  alert(data);
});
