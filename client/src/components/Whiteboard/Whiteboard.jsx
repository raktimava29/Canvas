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
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const maxHistoryLength = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = scrollContainerRef.current;

    const width = container.clientWidth;
    const initialHeight = container.clientHeight;

    canvas.width = width;
    canvas.height = initialHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;

    // Save blank initial snapshot
    const initialImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialImage]);

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        const oldImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

        canvas.height += 500;

        ctx.lineCap = "round";
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;

        ctx.putImageData(oldImage, 0, 0);
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
    if (!isDrawing) return;
    ctxRef.current.closePath();
    setIsDrawing(false);

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

    setHistory(prev => {
      const updated = [...prev, snapshot];
      return updated.length > maxHistoryLength ? updated.slice(1) : updated;
    });

    setRedoHistory([]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    scrollContainerRef.current.scrollTop = 0;

    const blank = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([blank]);
    setRedoHistory([]);
  };

  const undo = () => {
    if (history.length <= 1) return;

    setHistory(prev => {
      const updated = [...prev];
      const current = updated.pop();
      setRedoHistory(r => [...r, current]);

      const previous = updated[updated.length - 1];
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(previous, 0, 0);

      return updated;
    });
  };

  const redo = () => {
    if (redoHistory.length === 0) return;

    setRedoHistory(prev => {
      const updated = [...prev];
      const next = updated.pop();

      setHistory(h => {
        const newHistory = [...h, next];
        return newHistory.length > maxHistoryLength ? newHistory.slice(1) : newHistory;
      });

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(next, 0, 0);

      return updated;
    });
  };

  return (
    <Box className="flex flex-col h-screen">
      <Box className="flex flex-row justify-between items-center py-2 px-4 border-b-2 border-black">
        <Box>
        <button onClick={clearCanvas} className="px-5 py-2.5 bg-red-600 text-white rounded border-none">
          Clear
        </button>
        <button onClick={undo} className="px-5 py-2.5 bg-blue-600 text-white rounded border-none ml-2">
          Undo
        </button>
        <button onClick={redo} className="px-5 py-2.5 bg-green-600 text-white rounded border-none ml-2">
          Redo
        </button>
        </Box>
        <MySlider value={lineWidth} onChange={setLineWidth} />
        <MyPicker value={strokeColor} onExchange={setStrokeColor} />
      </Box>

      <Box
        ref={scrollContainerRef}
        className="overflow-auto no-scrollbar h-[100vh] m-12 mt-4"
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
