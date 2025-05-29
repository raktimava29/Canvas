import { Box, Center, Flex, Heading, Input, Text } from '@chakra-ui/react';
import { useState } from 'react';
import Notepad from '../Notepad/Notepad';
import Whiteboard from '../Whiteboard/Whiteboard';
import { ColorModeProvider, ColorModeButton, useColorModeValue } from '../ui/color-mode';

const Home = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isYouTube, setIsYouTube] = useState(false);
  const [error, setError] = useState(null);

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

  const bg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('black', 'whiteAlpha.900');
  const borderColor = useColorModeValue('black', 'whiteAlpha.700');
  const color = useColorModeValue("white", "gray.900");

  return (
    <ColorModeProvider>
      <Box bg={bg} color={textColor} paddingY='4'>
        <Flex justify="space-between" marginX="4" align="center">
          <Box w="40px" />
          <Text className="text-3xl font-bold" textAlign="center" flex="1">
            Study Buddy
          </Text>
          <Box w="40px">
            <ColorModeButton/>
          </Box>
        </Flex>

        <Box className="mb-4 p-4">
        <Input
        placeholder="Paste video URL and press Enter"
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`border-2 focus:outline-none p-2 w-full mb-4`}
        borderColor={borderColor}
        bg={useColorModeValue('#f9f9f9', '#00000')}
        color={textColor}
        mb={4}
        />


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
              />
            </Center>
          )}

          {error && <Center className="text-red-500">{error}</Center>}
        </Box>

        <Flex wrap="wrap">
          <Box width="49vw">
            <Notepad />
          </Box>
          <Box width="49vw">
            <Whiteboard />
          </Box>
        </Flex>
      </Box>
    </ColorModeProvider>
  );
};

export default Home;
