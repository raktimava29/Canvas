import { Box, Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import MySlider from "./Slider";
import MyPicker from "./Color";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const Whiteboard = forwardRef((props, ref) => {
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

  const bgColor = useColorModeValue("gray.100", "gray.900");
  const borderColor = useColorModeValue("black", "white");

  useImperativeHandle(ref, () => ({
  exportCanvasAsImage: () => {
    const canvas = canvasRef.current;
    return canvas.toDataURL("image/png");
  },
  loadCanvasFromImage: (dataURL) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataURL;
  }
}));


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
    if (ctxRef.current) ctxRef.current.strokeStyle = strokeColor;
  }, [strokeColor]);

  useEffect(() => {
    if (ctxRef.current) ctxRef.current.lineWidth = lineWidth;
  }, [lineWidth]);

  useEffect(() => {
    setStrokeColor(defaultStroke);
  }, [defaultStroke]);

  const getCanvasCoords = (nativeEvent) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: nativeEvent.clientX - rect.left,
      y: nativeEvent.clientY - rect.top,
    };
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
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    ctxRef.current.closePath();
    setIsDrawing(false);

    const canvas = canvasRef.current;
    const snapshot = ctxRef.current.getImageData(0, 0, canvas.width, canvas.height);

    setHistory((prev) => {
      const updated = [...prev, snapshot];
      return updated.length > maxHistoryLength ? updated.slice(1) : updated;
    });

    setRedoHistory([]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);

    setHistory((prev) => {
      const updated = [...prev, snapshot];
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
      ctxRef.current.putImageData(previous, 0, 0);
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
      ctxRef.current.putImageData(next, 0, 0);
      return updated;
    });
  };

  const invertBlackWhite = (imageData) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      if (r === 0 && g === 0 && b === 0) {
        data[i] = data[i + 1] = data[i + 2] = 255;
      } else if (r === 255 && g === 255 && b === 255) {
        data[i] = data[i + 1] = data[i + 2] = 0;
      }
    }
    return imageData;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !prevDefaultStroke) return;

    const switchingDarkToLight = prevDefaultStroke === "#ffffff" && defaultStroke === "#000000";
    const switchingLightToDark = prevDefaultStroke === "#000000" && defaultStroke === "#ffffff";

    if (switchingDarkToLight || switchingLightToDark) {
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const inverted = invertBlackWhite(image);
      ctx.putImageData(inverted, 0, 0);
    }
  }, [defaultStroke, prevDefaultStroke]);

  return (
    <Flex direction="column" flex="1">
      <Flex justify="space-between" align="center" py={2} px={4}>
        <Flex gap={2}>
          <Button colorScheme="red" onClick={clearCanvas}>
            Clear
          </Button>
          <Button colorScheme="blue" onClick={undo}>
            Undo
          </Button>
          <Button colorScheme="green" onClick={redo}>
            Redo
          </Button>
        </Flex>

        <MySlider value={lineWidth} onChange={setLineWidth} />
        <MyPicker value={strokeColor} onExchange={setStrokeColor} />
      </Flex>

      <Box
        ref={scrollContainerRef}
        className="overflow-auto no-scrollbar rounded-md h-[99.7vh]"
        borderWidth="1px"
        borderColor={borderColor}
        bg={bgColor}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          className="cursor-crosshair block w-full"
          style={{ borderColor }}
        />
      </Box>
    </Flex>
  );
});

export default Whiteboard;
