import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
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
    console.log('📤 Attempting to save notepad content...');
    try {
      const payload = {
        videoUrl: inputUrl,
        notepadText: note,
      };

      const headers = {
        Authorization: `Bearer ${user?.token}`,
        'Content-type': 'application/json',
      };

      console.log('Request Payload:', payload);
      console.log('Request Headers:', headers);

      const res = await axios.post('/api/content/save', payload, { headers });

      console.log('✅ Notepad saved successfully:', res.data);
    } catch (err) {
      console.error('❌ Save failed:', err.response?.data || err.message);
    }
  };

  const fetchContent = async (url) => {
    console.log('🔍 Fetching content for URL:', url);
    try {
      const res = await axios.get('/api/content', {
        params: { videoUrl: url },
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const data = res.data;
      console.log('✅ Content fetched:', data);

      setNotepadText(data.notepadText || '');
      setIsReadOnly(data.user !== user?._id);
    } catch (err) {
      console.error('❌ Fetch failed:', err.response?.data || err.message);
      setNotepadText('');
      setIsReadOnly(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setError(null);
      try {
        const url = new URL(inputUrl);
        let videoId = '';

        if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
          if (url.hostname === 'youtu.be') {
            videoId = url.pathname.slice(1);
          } else {
            videoId = url.searchParams.get('v');
          }

          if (!videoId) throw new Error('Invalid YouTube URL');
          const finalUrl = `https://www.youtube.com/embed/${videoId}`;
          console.log('🎥 Parsed YouTube embed URL:', finalUrl);
          setVideoUrl(finalUrl);
          setIsYouTube(true);
          fetchContent(finalUrl);
        } else if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
          console.log('🎥 Using direct video URL:', inputUrl);
          setVideoUrl(inputUrl);
          setIsYouTube(false);
          fetchContent(inputUrl);
        } else {
          throw new Error('Unsupported video format or platform');
        }
      } catch (err) {
        console.error('❌ Invalid URL entered:', err.message);
        setVideoUrl('');
        setIsYouTube(false);
        setError('❌ Invalid or unsupported video link.');
      }
    }
  };

  useEffect(() => {
    if (videoUrl) {
      fetchContent(videoUrl);
    }
  }, [videoUrl]);

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
            setText={(newText) => {
              setNotepadText(newText);
              saveNotepad(newText);
            }}
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
