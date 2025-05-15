import { ColorPicker, HStack, Portal, parseColor } from "@chakra-ui/react";

function MyPicker({ value, onExchange }) {
  return (
    /* <label htmlFor="color-picker" className="relative inline-block">
            <div
            className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
            style={{ backgroundColor: strokeColor }}
            ></div>
            <input
                id="color-picker"
                type="color"
                value={strokeColor}
                onChange={(e) => setStrokeColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
            />
            </label> */
    <ColorPicker.Root 
      value={parseColor(value)} 
      onChange={(e) => onExchange(e.target.value)} 
      width="150px"
    >
      <ColorPicker.HiddenInput />
      <ColorPicker.Control>
        <ColorPicker.Input className="border-2 border-black p-2" />
        <ColorPicker.Trigger />
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <ColorPicker.Area />
            <HStack>
              <ColorPicker.Sliders />
            </HStack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
}

export default MyPicker;
