import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Text,
  useColorModeValue,
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

  const bg = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('black', 'whiteAlpha.900');
  const borderColor = useColorModeValue('black', 'whiteAlpha.700');

  const API_URL = import.meta.env.VITE_API_URL;
  
  const saveNotepad = useCallback(async (note) => {
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
    console.log('Saved successfully:', res.data);
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
    <Box bg={bg} color={textColor} py={4} className="font-openSans">
      <Flex justify="space-between" mx={4} align="center">
        <SideDrawer />
        <UserProfileModal />
        <Text
          fontSize="3xl"
          fontWeight="bold"
          textAlign="center"
          flex="1"
          marginLeft="-100"
          className="bg-gradient-to-b from-[#57a0e9] to-[#212b35] bg-clip-text text-transparent"
        >
          MindTube
        </Text>
        <ColorModeButton />
      </Flex>

      <Box p={4} mb={4}>
       <Flex gap={4}>
          <Input
            placeholder="Paste video URL and press Enter"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            borderColor={borderColor}
            color={textColor}
            mb={4}
          />
          <Button 
            borderWidth="2px"
            borderColor={borderColor}
            onClick={() => saveNotepad(notepadText)}
            >
            Save
          </Button>
        </Flex>

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
                onError={() => setError('❌ Could not load the video.')}
                style={{ maxWidth: '70vw', maxHeight: '70vh' }}
              />
            )}
          </Center>
        )}

        {error && <Center color="red.500">{error}</Center>}
      </Box>

      <Flex gap={2}>
        <Box flex="0 0 35%">
          <Notepad
            text={notepadText}
            setText={setNotepadText}
            isReadOnly={isReadOnly}
          />
        </Box>
        <Box flex="0 0 63%">
          <Whiteboard ref={whiteboardRef} isReadOnly={isReadOnly} />
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
