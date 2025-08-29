import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
  useDisclosure,
  useToast,
  VStack,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigateTo = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter something to search.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      console.log(userInfo);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/api/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: 'Error searching users',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

    const bgColor = useColorModeValue("gray.100", "gray.800");
    const hoverColor = useColorModeValue("gray.300", "gray.600");
    const borderColor = useColorModeValue("blue.400", "blue.200");

  return (
    <>
      <IconButton
        icon={<SearchIcon />}
        onClick={onOpen}
        colorScheme="blue"
        variant='ghost'
        m={2}
        aria-label="Search Users"
        borderWidth="2px"
        borderColor={borderColor}
      />
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" mb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch} colorScheme="blue">
                Go
              </Button>
            </Box>
            {loading ? (
              <Spinner />
            ) : (
              <VStack align="stretch" spacing={3}>
                {searchResult.map((user) => (
                  <Box
                    key={user._id}
                    p={3}
                    borderRadius="lg"
                    bg={bgColor}
                    _hover={{ bg: hoverColor, cursor: 'pointer' }}
                    onClick={() => {
                      console.log('Selected user:', user);
                      navigateTo(`/${user._id}`);
                      onClose();
                    }}
                  >
                    {user.name} ({user.email})
                  </Box>
                ))}
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
