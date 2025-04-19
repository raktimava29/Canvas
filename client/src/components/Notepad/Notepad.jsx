import { Button, ButtonGroup, Flex, Text, Textarea, Theme } from "@chakra-ui/react";
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

  // Download as .txt file
  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "notes.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Flex padding={4} direction="column" className="h-screen">
      <Flex justify="space-between" align="center">
        <Text className="text-xl font-bold">📝 Notepad</Text>
        <Button
        size="lg"
        onClick={handleDownload}
        className="bg-blue-600 text-white px-4 py-1 rounded shadow hover:bg-blue-700 transition"
        >
          Save as .txt
        </Button>
      </Flex>

      <Textarea variant="outline"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing here..."
        className="w-full flex-1 resize-none p-4 mt-4 text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
      />
    </Flex>
  );
};

export default Notepad;
