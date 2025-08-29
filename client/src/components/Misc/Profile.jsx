import {
  Avatar,
  Box,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  useDisclosure,
  useColorModeValue,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigateTo = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("userInfo"));
  } catch (err) {
    console.warn("Invalid userInfo in localStorage");
  }

  const modalBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("black", "white");

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigateTo("/");
  };

  const name = user?.name || "User";
  const email = user?.email || "No Email";
  const avatarSrc = user?.pic || "/profile-icon.png"; 

  return (
    <>
      <Tooltip label="Profile" hasArrow>
        <IconButton
          icon={<FaUser />}
          onClick={onOpen}
          variant="ghost"
          aria-label="View Profile"
          borderWidth="2px"
          borderColor={borderColor}
        />
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>My Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={4}
            pb={6}
          >
            <Avatar size="xl" name={name} src={avatarSrc} />
            <Text fontSize="lg" fontWeight="bold">
              {name}
            </Text>
            <Text>{email}</Text>
           {user ? 
            <Button mt={4} onClick={handleLogout} colorScheme="red">Logout</Button> :
            <Button mt={4} onClick={() =>navigateTo('/login')} colorScheme="red">Login</Button>
           }
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserProfile;
