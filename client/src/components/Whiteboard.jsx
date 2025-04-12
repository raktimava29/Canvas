import { Box } from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import { Slider } from "@chakra-ui/react"

function Whiteboard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth,setLineWidth] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, [lineWidth]);

  const startDrawing = ({ nativeEvent }) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
  
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;
  
    ctxRef.current.lineWidth = lineWidth;
  
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };
  

  const endDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <Box 
      className="w-[100vw] h-[50vh]"
      borderWidth="5px"
      borderColor="red"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        className="border border-black cursor-crosshair w-full h-full block"
      />
      <button
        onClick={clearCanvas}
        className="absolute top-5 left-5 px-5 py-2.5 bg-red-600 text-white rounded z-10 border-none"
      >
        Clear
      </button>
      <Box
      className="absolute top-7 left-1/4"
      >
      <Slider.Root
        width="200px" 
        defaultValue={[lineWidth]}
        min={1}
        max={20}
        onValueChange={(e) => {
            console.log("Value : ",e)
            setLineWidth(e.value)
        }}
        >
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
      </Box>
    </Box>
  );
}

export default Whiteboard;