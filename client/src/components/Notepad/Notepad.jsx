import { Button, Flex, Text, Textarea } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const Notepad = () => {
  const [content, setContent] = useState("");

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
    <Flex direction="column" p='2' flex="1" height="100vh">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold">📝 Notepad</Text>
        <Button colorScheme="blue" onClick={handleDownload}>
          Save as .txt
        </Button>
      </Flex>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing here..."
        resize="none"
        height="100%"
        flex="1"
        fontFamily="monospace"
        bg="white"
        borderColor="gray.300"
        _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
      />
    </Flex>
  );
};

export default Notepad;
