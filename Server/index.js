// const express = require("express");
// const bodyParser = require("body-parser");
// const { Server } = require("socket.io");

// const io = new Server({
//     cors:true,
// });
// const app = express();

// app.use(bodyParser.json());

// const emailToSocketMapping = new Map();
// const socketToEmailMapping=new Map();

// io.on("connection", (socket) => {
//     console.log("New Connection")
//   socket.on("join-room", (data) => {
//     const { roomId, emailId } = data;
//     console.log("User", emailId, "Joined Room", roomId);

//     emailToSocketMapping.set(emailId, socket.id);
//     socketToEmailMapping.set(socket.id,emailId);
//     socket.join(roomId);
//     socket.emit('joined-room',{roomId});
//     socket.broadcast.to(roomId).emit("user-joined", { emailId });
//   });

//   socket.on('call-user',data=>{
//     const {emailId,offer}=data;
//     const fromEmail=socketToEmailMapping.get(socket.id);
//     const socketId=emailToSocketMapping.get(emailId);
//     socket.to(socketId).emit('incoming-call',{from:fromEmail,offer})
//   })
//   socket.on('call-accepted',data=>{
//     const {emailId,ans}=data;
//     const socketId=emailToSocketMapping.get(emailId);
//     socket.to(socketId).emit('call-accepted',{ans});
//   })
// });

// app.listen(8000, () => console.log("HTTP server running at paort 8000"));
// io.listen(8001);
const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});