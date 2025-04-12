import { Box, Text } from "@chakra-ui/react";

function App(){
  
  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">My React App</h1>
      <Box bg="black" className="size-1/5">
        <Text className="text-white">Hello</Text>
      </Box>
    </div>
  );
}

export default App;