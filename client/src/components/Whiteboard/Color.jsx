import { Box, Text, Input } from "@chakra-ui/react";

const MyPicker = ({ value, onExchange }) => {
  return (
    <Box mx={4}>
      <Text mb={1} fontSize="sm" fontWeight="medium">
        Stroke Color
      </Text>
      <Input
        type="color"
        value={value}
        onChange={(e) => onExchange(e.target.value)}
        width="80px"
        height="30px"
        padding="0"
        border="none"
        background="none"
        cursor="pointer"
      />
    </Box>
  );
};

export default MyPicker;
