import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import Notepad from "./Notepad/Notepad";
import { Box, useColorModeValue } from "@chakra-ui/react";

const socket = io("http://localhost:5000");

export default function Test() {
  const { id: roomId } = useParams();

  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const bg = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('black', 'whiteAlpha.900');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    setUser(storedUser);

    socket.emit("join-room", roomId);
    console.log(roomId);
    console.log(storedUser._id);

    socket.on("note:sync", (data) => {
        setText(data.content);
      });

    return () => {  
      socket.off("note:sync");
    };
  }, [roomId]);

  const handleChange = (value) => {
  setText(value);
  socket.emit("note:update", { roomId, content: value });
};

  return (
    <Box bg={bg} color={textColor} pb={2} className="font-openSans">
      
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

      <div className="w-[50vw]">
        <Notepad
        text={text}
        setText={handleChange}
        isReadOnly={isReadOnly}
      />
      </div>

    </Box>
  );
}