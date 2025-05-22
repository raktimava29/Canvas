import { ColorPicker, HStack, Portal, parseColor } from "@chakra-ui/react"
import { useColorModeValue } from "../ui/color-mode";

function MyPicker({value,onExchange}){

  const borderColor = useColorModeValue("black", "white");

    return(
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
                defaultValue={parseColor(value)} 
                width="150px"
                onChange={(e) => onExchange(e.target.value)}
                >
              <ColorPicker.HiddenInput />
              <ColorPicker.Control>
                <ColorPicker.Input
                  className="p-2"
                  style={{ border: `2px solid ${borderColor}` }}
                />
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
    )
}

export default MyPicker;