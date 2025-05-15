import { Slider } from "@chakra-ui/react";

function MySlider({ value, onChange }) {
  return (
    <Slider.Root
      width="200px"
      value={[value]} // <-- make it controlled
      min={1}
      max={20}
      onValueChange={(e) => onChange(e.value)}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumbs />
      </Slider.Control>
    </Slider.Root>
  );
}

export default MySlider;
