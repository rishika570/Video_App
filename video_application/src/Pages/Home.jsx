import React, { useState, useEffect } from "react";
import { useSocket } from "../Providers/Socket";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { socket } = useSocket();
  const navigate=useNavigate();
  const [email, setEmail] = useState();
  const [roomId, setRoomId] = useState();
  const handleRoomJoined = ({ roomId }) => {
    navigate(`/room/${roomId}`)
  };
  useEffect(() => {
    socket.on("joined-room",handleRoomJoined);
  }, [socket]);

  const handleJoinRoom = () => {
    socket.emit("join-room", { emailId: email, roomId });
  };

  return (
    <div className="homepage-container">
      <div className="input-container">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email here"
        />
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="Enter Room code"
        />
        <button onClick={handleJoinRoom}>Enter room</button>
      </div>
    </div>
  );
};

export default Home;