import { Box, Button, Flex } from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import MySlider from "./Slider";
import MyPicker from "./Color";
import { useColorModeValue } from "../ui/color-mode";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);

  const defaultStroke = useColorModeValue("#000000", "#ffffff");
  const prevDefaultStroke = usePrevious(defaultStroke);
  const [strokeColor, setStrokeColor] = useState(defaultStroke);

  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const maxHistoryLength = 20;

  const bg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("black", "white");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = scrollContainerRef.current;

    const width = container.clientWidth;
    const hugeHeight = 20000;

    canvas.width = width;
    canvas.height = hugeHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;

    const initialImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialImage]);

  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = strokeColor;
    }
  }, [strokeColor]);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.lineWidth = lineWidth;
    }
  }, [lineWidth]);

  useEffect(() => {
    setStrokeColor(defaultStroke);
  }, [defaultStroke]);

  const getCanvasCoords = (nativeEvent) => {
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();

  const x = nativeEvent.clientX - rect.left;
  const y = nativeEvent.clientY - rect.top;

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

    setHistory((prev) => {
      const updated = [...prev, snapshot];
      return updated.length > maxHistoryLength ? updated.slice(1) : updated;
    });

    setRedoHistory([]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => {
      const updated = [...prev, currentImage];
      return updated.length > maxHistoryLength ? updated.slice(1) : updated;
    });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    scrollContainerRef.current.scrollTop = 0;
    setRedoHistory([]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    setHistory((prev) => {
      const updated = [...prev];
      const current = updated.pop();
      setRedoHistory((r) => [...r, current]);
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
    setRedoHistory((prev) => {
      const updated = [...prev];
      const next = updated.pop();
      setHistory((h) => {
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

  const invertBlackWhite = (imageData) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];

      const isBlack = r === 0 && g === 0 && b === 0;
      const isWhite = r === 255 && g === 255 && b === 255;

      if (isBlack) {
        data[i] = data[i + 1] = data[i + 2] = 255; // to white
      } else if (isWhite) {
        data[i] = data[i + 1] = data[i + 2] = 0; // to black
      }
    }
    return imageData;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx || !prevDefaultStroke) return;

    const switchingFromDarkToLight = prevDefaultStroke === "#ffffff" && defaultStroke === "#000000";
    const switchingFromLightToDark = prevDefaultStroke === "#000000" && defaultStroke === "#ffffff";

    if (switchingFromDarkToLight || switchingFromLightToDark) {
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const inverted = invertBlackWhite(image);
      ctx.putImageData(inverted, 0, 0);
    }
  }, [defaultStroke, prevDefaultStroke]); 

  return (
    <Flex direction="column" flex="1">
      <Flex
        justify="space-between"
        align="center"
        py={2}
        px={4}
        borderBottom="2px"
        borderColor={borderColor}
      >
        <Box>
          <Button onClick={clearCanvas} size='md' className="bg-red-600 hover:bg-red-500 font-openSans">
            Clear
          </Button>
          <Button onClick={undo} size='md' className="bg-blue-600 hover:bg-blue-500 ml-2 font-openSans">
            Undo
          </Button>
          <Button onClick={redo} size='md' className="bg-green-600 hover:bg-green-500 ml-2 font-openSans">
            Redo
          </Button>
        </Box>
        <MySlider value={lineWidth} onChange={setLineWidth} />
        <MyPicker value={strokeColor} onExchange={setStrokeColor} />
      </Flex>

      <Box
        ref={scrollContainerRef}
        className="overflow-auto no-scrollbar rounded-md mt-1 h-[100vh]"
        borderWidth="1px"
        borderColor={borderColor}
        bg={bg}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          className="cursor-crosshair block w-full border"
          style={{ borderColor }}
        />
      </Box>
    </Flex>
  );
};

export default Whiteboard;
