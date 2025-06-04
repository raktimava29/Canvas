import { Box, Button, Flex, Text, Textarea, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const Notepad = () => {
  const [content, setContent] = useState("");

  const bg = useColorModeValue("white", "gray.900");
  const color = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const btnBg = useColorModeValue("black", "white");
  const btnColor = useColorModeValue("white", "black");
  const btnHoverBg = useColorModeValue("gray.800", "gray.300");

  useEffect(() => {
    const saved = localStorage.getItem("windows-notepad");
    if (saved) setContent(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("windows-notepad", content);
  }, [content]);

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "notes.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Flex direction="column" p={4} bg={bg} color={color}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" className="font-openSans">
          📝 Notepad
        </Text>
        <Button
          onClick={handleDownload}
          bg={btnBg}
          color={btnColor}
          _hover={{ bg: btnHoverBg }}
          px={4}
          py={2}
          size="md"
          rounded="md"
          className="font-openSans"
        >
          Save as .txt
        </Button>
      </Flex>

      <Box flex="1">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing here..."
          resize="none"
          minH="100vh"
          fontSize="md"
          className="font-openSans"
          bg={bg}
          color={color}
          borderColor={borderColor}
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px #3182ce",
          }}
        />
      </Box>
    </Flex>
  );
};

export default Notepad;
