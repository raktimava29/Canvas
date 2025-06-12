import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
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

  const user = JSON.parse(localStorage.getItem('userInfo'));

  const bg = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('black', 'whiteAlpha.900');
  const borderColor = useColorModeValue('black', 'whiteAlpha.700');

  const saveNotepad = async (note) => {
  try {
    console.log("Saving note:", note);
    console.log("For video URL:", videoUrl);

    const res = await axios.post(
      '/api/content/save',
      {
        videoUrl: inputUrl,
        notepadText: note,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-type': 'application/json',
        },
      }
    );
    console.log('Notepad saved:', res.data);
  } catch (err) {
    console.error('Save failed:', err);
  }
};

  const fetchContent = async (url) => {
    console.log('Fetching content for URL:', url);
    try {
      const res = await axios.get('/api/content', {
        params: { videoUrl: url },
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = res.data;
      console.log('Content fetched:', data);

      setNotepadText(data.notepadText || '');
      setIsReadOnly(data.user !== user?._id);
    } catch (err) {
      console.error('Fetch failed:', err.response?.data || err.message);
      setNotepadText('');
      setIsReadOnly(false);
    }
  };
  
  const handleKeyDown = (e) => {
  if (e.key !== 'Enter') return;
  setError(null);
  try {
    const url = new URL(inputUrl);
    const hostname = url.hostname;
    let videoId = '';
    let originalUrl = inputUrl;
    let isYouTube = false;

    if (hostname.includes('youtube.com') || hostname === 'youtu.be') {
    if (hostname === 'youtu.be') {
      videoId = url.pathname.slice(1); 
    } else if (url.pathname.startsWith('/shorts/')) {
      videoId = url.pathname.split('/shorts/')[1];
    } else {
      videoId = url.searchParams.get('v');
    }

    if (!videoId) throw new Error('Invalid YouTube URL');

    originalUrl = `https://www.youtube.com/watch?v=${videoId}`;
    setVideoUrl(`https://www.youtube.com/embed/${videoId}`);
    isYouTube = true;
  } else if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
      setVideoUrl(inputUrl);
    } else {
      throw new Error('Unsupported video format or platform');
    }

    setInputUrl(originalUrl);
    setIsYouTube(isYouTube);
    fetchContent(originalUrl);
  } catch (err) {
    console.error('❌ Invalid URL entered:', err.message);
    setVideoUrl('');
    setIsYouTube(false);
    setError('❌ Invalid or unsupported video link.');
  }
};

  return (
    <Box bg={bg} color={textColor} py={4} className="font-openSans">
      <Flex justify="space-between" mx={4} align="center">
        <SideDrawer />
        <UserProfileModal />
        <Box w="40px" />
        <Text fontSize="3xl" fontWeight="bold" textAlign="center" flex="1">
          Study Buddy
        </Text>
        <Box w="40px">
          <ColorModeButton />
        </Box>
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
          <Button onClick={() => saveNotepad(notepadText)}>Save</Button>
        </Flex>

        {videoUrl && isYouTube && (
          <Center>
            <iframe
              src={videoUrl}
              className="w-[70vw] h-[70vh]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube Player"
            />
          </Center>
        )}

        {videoUrl && !isYouTube && (
          <Center>
            <video
              src={videoUrl}
              controls
              onError={() => setError('❌ Could not load the video.')}
              style={{ maxWidth: '70vw', maxHeight: '70vh' }}
            />
          </Center>
        )}

        {error && <Center color="red.500">{error}</Center>}
      </Box>

      <Flex>
        <Box width="49%">
          <Notepad
            text={notepadText}
            setText={setNotepadText}
            isReadOnly={isReadOnly}
          />
        </Box>
        <Box width="50%">
          <Whiteboard />
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
