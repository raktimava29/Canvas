// MySlider.jsx
import { Box, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Text } from "@chakra-ui/react";

const MySlider = ({ value, onChange }) => {
  return (
    <Box w="200px" mx={4}>
      <Text mb={1} fontSize="sm" fontWeight="medium">
        Line Width: {value}
      </Text>
      <Slider
        aria-label="line-width-slider"
        value={value}
        min={1}
        max={30}
        onChange={onChange}
      >
        <SliderTrack>
          <SliderFilledTrack bg="blue.500" />
        </SliderTrack>
        <SliderThumb boxSize={4} />
      </Slider>
    </Box>
  );
};

export default MySlider;
