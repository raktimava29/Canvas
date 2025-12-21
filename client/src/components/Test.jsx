import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

export default function Test() {
  const { id: roomId } = useParams(); // get /content/:id from URL

  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load logged-in user from localStorage (modify key if needed)
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setUser(storedUser);

    // Join Socket Room
    socket.emit("join-room", roomId);

    // Listen for incoming notes
    socket.on("note:sync", (data) => {
        setText(data.content);
      });

    return () => {
      socket.off("note:sync");
    };
  }, [roomId]);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    socket.emit("note:update", { roomId, content: value });
  };

  return (
    <div style={{ padding: 20 }}>
      
      {/* Logged-in User Section */}
      <div
        style={{
          marginBottom: 20,
          padding: 10,
          border: "1px solid #ddd",
          borderRadius: 6,
          background: "black",
          fontSize: 14
        }}
      >
        <strong>Logged in as:</strong> <br />
        Name: {user?.name || "Unknown"} <br />
        Email: {user?.email || "Unknown"} <br />
        <small>Room: {roomId}</small>
      </div>

      {/* Realtime Textarea */}
      <textarea
        value={text}
        onChange={handleChange}
        rows={10}
        cols={50}
        style={{
          border: "1px solid black",
          width: "100%",
          padding: 10,
          fontSize: 16,
        }}
      />

    </div>
  );
}