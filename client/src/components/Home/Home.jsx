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
import Notepad from '../Notepad/Notepad';
import Whiteboard from '../Whiteboard/Whiteboard';
import SideDrawer from '../Misc/SideDrawer';
import UserProfileModal from '../Misc/Profile';
import ColorModeButton from '../Misc/ColorToggle';

const Home = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isYouTube, setIsYouTube] = useState(false);
  const [error, setError] = useState(null);
  const [align,setAlign] = useState(true);

  const press = () => {
    {align ? setAlign(false) : setAlign(true)};
    console.log(align);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setError(null);
      try {
        const url = new URL(inputUrl);

        if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
          let videoId = '';
          if (url.hostname === 'youtu.be') {
            videoId = url.pathname.slice(1);
          } else {
            videoId = url.searchParams.get('v');
          }
          if (!videoId) throw new Error('Invalid YouTube URL');
          setVideoUrl(`https://www.youtube.com/embed/${videoId}`);
          setIsYouTube(true);
        } else if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
          setVideoUrl(inputUrl);
          setIsYouTube(false);
        } else {
          throw new Error('Unsupported video format or platform');
        }
      } catch (err) {
        setVideoUrl('');
        setIsYouTube(false);
        setError('❌ Invalid or unsupported video link.');
      }
    }
  };

  const bg = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('black', 'whiteAlpha.900');
  const borderColor = useColorModeValue('black', 'whiteAlpha.700');

  return (
    <Box bg={bg} color={textColor} py={4} className="font-openSans">
      <Flex justify="space-between" mx={4} align="center">
        <SideDrawer/>
        <UserProfileModal/>
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
        <Button onClick={press}>Press</Button>
        </Flex>
        {videoUrl && isYouTube && (
          <Center>
            <iframe
              src={videoUrl}
              className="w-[70vw] h-[70vh]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
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

      <Flex direction={align ? 'column' : 'row'}>
      <Box width={align ? '100%' : '49%'}>
        <Notepad />
      </Box>
      <Box width={align ? '98%' : '50%'} margin={align ? '20px' : '0px'}>
        <Whiteboard />
      </Box>
    </Flex>
    </Box>
  );
};

export default Home;
