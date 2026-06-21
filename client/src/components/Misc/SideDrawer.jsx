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
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios"

const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigateTo = useNavigate();

  const handleSearch = async () => {
    if (!search.trim()) {
      toast({
        title: 'Please enter something to search.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      const { data } = await api.get(`/api/user?search=${search}`);
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
        _hover={{
        bg: useColorModeValue('blue.100', 'whiteAlpha.200'),
        borderColor: useColorModeValue('blue.300', 'blue.200'),
        transform: 'scale(1.05)',
        transition: 'all 0.2s ease',
      }}
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
