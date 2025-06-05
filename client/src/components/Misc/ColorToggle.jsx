import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { 
    IconButton,
  useColorMode, 
  useColorModeValue 
} from "@chakra-ui/react";

const ColorModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const borderColor = useColorModeValue("black", "white");
  return (
    <IconButton
      size="md"
      aria-label="Toggle color mode"
      onClick={toggleColorMode}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      variant="ghost"
      borderWidth="2px"
      borderColor={borderColor}
    />
  );
};

export default ColorModeButton;