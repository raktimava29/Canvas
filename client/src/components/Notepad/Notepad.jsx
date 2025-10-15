import {
  Box,
  Button,
  Flex,
  Heading,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback } from "react";

const Notepad = ({ text, setText, isReadOnly }) => {
  const bg = useColorModeValue("gray.100", "gray.900");
  const color = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.400", "gray.600");
  const btnBg = useColorModeValue("black", "white");
  const btnColor = useColorModeValue("white", "black");
  const btnHoverBg = useColorModeValue("gray.800", "gray.300");

  const handleDownload = useCallback(() => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "notes.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  }, [text]);

  return (
    <Flex direction="column" p={4} bg={bg} color={color}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading fontSize="2xl" fontWeight="bold" className="font-openSans">
          📝 Notepad
        </Heading>
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

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing here..."
        resize="none"
        minH="100vh"
        fontSize="md"
        className="font-openSans"
        bg={bg}
        color={color}
        borderColor={borderColor}
        isReadOnly={isReadOnly}
        _focus={{
          borderColor: "blue.500",
          boxShadow: "0 0 0 1px #3182ce",
        }}
      />
    </Flex>
  );
};

export default Notepad;
