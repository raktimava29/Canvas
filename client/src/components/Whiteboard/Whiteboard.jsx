import { Box } from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import MySlider from "./Slider";
import MyPicker from "./Color";

function Whiteboard() {
  const canvasRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [strokeColor, setStrokeColor] = useState("#000000");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = scrollContainerRef.current;

    const width = container.clientWidth;
    const initialHeight = 1000;

    canvas.width = width;
    canvas.height = initialHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        const newHeight = canvas.height + 500;
        const oldImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        canvas.height = newHeight;

        ctx.lineCap = "round";
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;

        ctx.putImageData(oldImageData, 0, 0);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const getCanvasCoords = (nativeEvent) => {
    const canvas = canvasRef.current;
    const x = nativeEvent.clientX - canvas.offsetLeft;
    const y = nativeEvent.clientY - canvas.offsetTop + scrollContainerRef.current.scrollTop;
    return { x, y };
  };
  
  const startDrawing = ({ nativeEvent }) => {
    const { x, y } = getCanvasCoords(nativeEvent);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };
  
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { x, y } = getCanvasCoords(nativeEvent);
  
    ctxRef.current.lineWidth = lineWidth;
    ctxRef.current.strokeStyle = strokeColor;
  
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
    scrollContainerRef.current.scrollTop = 0;
  };  

  return (
    <Box className="flex flex-col h-screen">
      <Box className="flex flex-row justify-between items-center py-2 px-4 border-b-2 border-black">
        <button
          onClick={clearCanvas}
          className="px-5 py-2.5 bg-red-600 text-white rounded border-none"
        >
          Clear
        </button>
        <MySlider value={lineWidth} onChange={setLineWidth}></MySlider>
        <MyPicker value={strokeColor} onExchange={setStrokeColor}></MyPicker>
      </Box>

      <Box
        ref={scrollContainerRef}
        className="overflow-auto no-scrollbar m-12 mt-4"
        borderWidth="2px"
        borderColor="black"
        // css={{
        // '&::-webkit-scrollbar': {
        // display: 'none',
        // },
        // scrollbarWidth: 'none',     // Firefox
        // msOverflowStyle: 'none',    // IE & Edge
        // }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          className="cursor-crosshair w-full block border border-black"
        />
      </Box>
    </Box>
  );
}

export default Whiteboard;
