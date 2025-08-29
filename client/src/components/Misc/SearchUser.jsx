import {
  Box,
  Center,
  Flex,
  Heading,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Notepad from '../Notepad/Notepad';
import Whiteboard from '../Whiteboard/Whiteboard';
import ColorModeButton from '../Misc/ColorToggle';

const SearchUser = () => {
  const { id } = useParams();
  const whiteboardRef = useRef();

  const [inputUrl, setInputUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [notepadText, setNotepadText] = useState('');
  const [isYouTube, setIsYouTube] = useState(false);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');

  const bg = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('black', 'whiteAlpha.900');
  const borderColor = useColorModeValue('black', 'whiteAlpha.700');

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
  const fetchUserName = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user/${id}`); 
      setUserName(data.name);
    } catch (err) {
      console.error('Failed to fetch user name:', err);
    }
  };

  fetchUserName();
}, [id]);

  const fetchContent = async (url) => {
    console.log(id);
    console.log('Fetching content for URL:', url);
    try {
      const res = await axios.get(`${API_URL}/api/content/shared`, {
        params: {
            videoUrl: url,
            userId: id, 
        },
        });
      
      const data = res.data;
      console.log('Content fetched:', data);

      const { notepadText, canvasImage } = res.data;
      setNotepadText(notepadText || '');

      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      let videoId = '';

      if (hostname.includes('youtube.com') || hostname === 'youtu.be') {
        if (hostname === 'youtu.be') {
          videoId = urlObj.pathname.slice(1);
        } else if (urlObj.pathname.startsWith('/shorts/')) {
          videoId = urlObj.pathname.split('/shorts/')[1];
        } else {
          videoId = urlObj.searchParams.get('v');
        }

        if (!videoId) throw new Error('Invalid YouTube URL');
        setVideoUrl(`https://www.youtube.com/embed/${videoId}`);
        setIsYouTube(true);
      } else {
        setVideoUrl(url);
        setIsYouTube(false);
      }

      if (canvasImage && whiteboardRef.current?.loadCanvasFromImage) {
        whiteboardRef.current.loadCanvasFromImage(canvasImage);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('❌ No content found for this video.');
      setVideoUrl('');
      setNotepadText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    setError(null);
    try {
      const url = new URL(inputUrl);
      fetchContent(url.toString());
    } catch {
      setError('❌ Invalid URL format');
    }
  };

  return (
    <Box bg={bg} color={textColor} py={4} className="font-openSans">
      <Flex justify="space-between" mx={4} align="center">
        <Box w="40px" />
        <Heading className="font-openSans" textAlign="center" flex="1">
          Viewing {userName ? `${userName}’s` : 'User’s'} Shared Notes
        </Heading>
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
          <Notepad text={notepadText} setText={() => {}} isReadOnly={true} />
        </Box>
        <Box width="50%">
          <Whiteboard ref={whiteboardRef} isReadOnly={true} />
        </Box>
      </Flex>
    </Box>
  );
};

export default SearchUser;
