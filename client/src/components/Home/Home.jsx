import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  useColorModeValue,
  VStack,
  Container,
  Heading,
  Alert,
  AlertIcon,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import Notepad from '../Notepad/Notepad';
import Whiteboard from '../Whiteboard/Whiteboard';
import SideDrawer from '../Misc/SideDrawer';
import UserProfileModal from '../Misc/Profile';
import ColorModeButton from '../Misc/ColorToggle';

const Home = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isYouTube, setIsYouTube] = useState(false);
  const [notepadText, setNotepadText] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [error, setError] = useState(null);

  const whiteboardRef = useRef();
  const user = useMemo(() => JSON.parse(localStorage.getItem('userInfo')), []);
  const toast = useToast();

  const bg = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('black', 'whiteAlpha.900');
  const inputBg = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.800');
  const buttonBg = useColorModeValue('blue.500', 'blue.600');
  const buttonHoverBg = useColorModeValue('blue.600', 'blue.500');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');
  const inputBorderColorHover = useColorModeValue('gray.400', 'gray.500');

  const API_URL = import.meta.env.VITE_API_URL;
  
  const saveNotepad = useCallback(async (note) => {
    if (!inputUrl || !note) {
      toast({
        title: !inputUrl ? "Missing URL" : "Missing Text",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

  try {
    const canvasImage = whiteboardRef.current?.exportCanvasAsImage();
    const res = await axios.post(
      `${API_URL}/api/content/save`,
      { videoUrl: inputUrl, notepadText: note, canvasImage },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-type': 'application/json',
        },
      }
    );
  } catch (err) {
    console.error('Save failed:', err.response?.data || err.message);
  }
}, [inputUrl, user]);

const fetchContent = useCallback(async (url) => {
  try {
    const res = await axios.get(`${API_URL}/api/content`, {
      params: { videoUrl: url },
      headers: { Authorization: `Bearer ${user?.token}` },
    });

    const data = res.data;
    setNotepadText(data.notepadText || '');
    setIsReadOnly(data.user !== user?._id);

    if (data.canvasImage && whiteboardRef.current?.loadCanvasFromImage) {
      whiteboardRef.current.loadCanvasFromImage(data.canvasImage);
    }
  } catch (err) {
    console.error('Fetch failed:', err.response?.data || err.message);
    setNotepadText('');
    setIsReadOnly(false);
  }
}, [user]);

  const processUrl = useCallback(() => {
    setError(null);
    try {
      const url = new URL(inputUrl);
      let videoId = '';
      let originalUrl = inputUrl;
      let isYT = false;

      if (url.hostname.includes('youtube.com') || url.hostname === 'youtu.be') {
        isYT = true;
        if (url.hostname === 'youtu.be') {
          videoId = url.pathname.slice(1);
        } else if (url.pathname.startsWith('/shorts/')) {
          videoId = url.pathname.split('/shorts/')[1];
        } else {
          videoId = url.searchParams.get('v');
        }

        if (!videoId) throw new Error('Invalid YouTube URL');
        originalUrl = `https://www.youtube.com/watch?v=${videoId}`;
        setVideoUrl(`https://www.youtube.com/embed/${videoId}`);
      } else if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
        setVideoUrl(inputUrl);
        isYT = false;
      } else {
        throw new Error('Unsupported video format or platform');
      }

      setInputUrl(originalUrl);
      setIsYouTube(isYT);
      fetchContent(originalUrl);
    } catch (err) {
      console.error('❌ Invalid URL entered:', err.message);
      setVideoUrl('');
      setIsYouTube(false);
      setError('❌ Invalid or unsupported video link.');
    }
  }, [inputUrl, fetchContent]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') processUrl();
  };

 return (
  <Box bg={bg} color={textColor} pb={2} className="font-openSans">
    <Box
      borderBottom="1px solid"
      borderColor={borderColor}
      bg={cardBg}
      shadow="sm"
      position="relative"
      top={0}
      zIndex={10}
    >
      <Container maxW="container.xl" py={4}>
        <Flex align="center" justify="space-between" gap={4}>
          <SideDrawer />

          <Heading
            as="h1"
            size="xl"
            flex="1"
            textAlign="center"
            className="bg-gradient-to-b from-[#57a0e9] to-[#212b35] bg-clip-text text-transparent"
            fontWeight="bold"
          >
            MindTube
          </Heading>

          <Flex align="center" gap={3}>
            <UserProfileModal />
            <ColorModeButton />
          </Flex>
        </Flex>
      </Container>
    </Box>

    <Container maxW="container.xl" py={6}>
      <Box
        bg={cardBg}
        p={6}
        borderRadius="xl"
        shadow="md"
        border="1px solid"
        borderColor={borderColor}
        mb={4}
      >
        <Flex gap={3} flexDirection={{ base: "column", md: "row" }}>
          <Input
            placeholder="Paste video URL (YouTube, MP4, WebM, OGG) and press Enter"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            bg={inputBg}
            borderColor={inputBorderColor}
            color={textColor}
            size="lg"
            _hover={{
              borderColor: inputBorderColorHover,
            }}
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
            }}
            flex="1"
            transition="all 0.2s"
          />

          <Button
            onClick={() => saveNotepad(notepadText)}
            bg={buttonBg}
            color="white"
            size="lg"
            px={8}
            fontWeight="semibold"
            _hover={{
              bg: buttonHoverBg,
              transform: "translateY(-1px)",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
          >
            Save
          </Button>
        </Flex>

        {error && (
          <Alert status="error" mt={4} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}
      </Box>
    </Container>

    <Box pb={4} mb={-4}>
      {videoUrl && (
        <Center>
          {isYouTube ? (
            <iframe
              src={videoUrl}
              className="w-[70vw] h-[70vh]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube Player"
            />
          ) : (
            <video
              src={videoUrl}
              controls
              onError={() => setError("❌ Could not load the video.")}
              style={{ maxWidth: "70vw", maxHeight: "70vh" }}
            />
          )}
        </Center>
      )}

      {error && <Center color="red.500">{error}</Center>}
    </Box>

    <div class="flex flex-col md:flex-col lg:flex-row gap-2">
      <div class="flex-shrink-0 flex-grow-0 md:basis-full lg:basis-[40%]">
        <Notepad
          text={notepadText}
          setText={setNotepadText}
          isReadOnly={isReadOnly}
        />
      </div>
      <div class="flex-shrink-0 flex-grow-0 md:basis-full lg:basis-[58%]">
        <Whiteboard ref={whiteboardRef} isReadOnly={isReadOnly} />
      </div>
    </div>

  </Box>
);
};

export default Home;