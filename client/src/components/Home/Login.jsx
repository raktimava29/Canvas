import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Flex,
  Input,
  InputGroup,
  Text,
  IconButton,
  useColorModeValue,
  useToast,
  InputRightElement,
} from "@chakra-ui/react";
import logo from "../../assets/study-logo.png";
import google from "../../assets/Frame.png";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SunIcon, MoonIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import ColorModeButton from "../Misc/ColorToggle";

const Login = () => {
  const navigateTo = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false)

  const bgGradient = useColorModeValue(
    "linear(to-br, gray.50, gray.100)",
    "linear(to-br, gray.900, gray.800)"
  );

  const borderColor = useColorModeValue("gray.300", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const linkColor = useColorModeValue("blue.600", "blue.400");
  const bgColor = useColorModeValue("white", "gray.800");
  const footerBg = useColorModeValue("gray.100", "gray.900");
  const footerColor = useColorModeValue("gray.500", "gray.400");

  const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const { data: googleData } = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );
      
      const { data: userData } = await axios.post('/api/user/google-login', {
        email: googleData.email,
        googleId: googleData.sub,
      });
      localStorage.setItem("userInfo", JSON.stringify(userData));
      toast({
        title: "Logged in with Google!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigateTo("/");
    } catch (error) {
      console.error("Google login failed:", error?.response?.data || error.message);

      toast({
        title: "Google login failed.",
        description: error?.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  },
  onError: () => {
    toast({
      title: "Google authentication was cancelled or failed.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  },
});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please fill out all fields.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } else {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
          },
        };

        const { data } = await axios.post('/api/user/login', { email, password }, config);

        toast({
          title: 'Login Successful',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigateTo('/');
      } catch (error) {
        toast({
          title: 'Error Occurred!',
          description: error.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  return (
    <Box bg={bgColor} color={textColor} minH="100vh">
      <Flex color={footerColor} bg={footerBg} py={2} px={4} align="center">
        <Box w="40px" />
        <Center flex="1">
          <img src={logo} alt="logo" />
        </Center>
        <Box w="40px" textAlign="right">
          <ColorModeButton />
        </Box>
      </Flex>

      <Box height="83.5vh" position="relative">
        <AbsoluteCenter>
          <Box
            bgGradient={bgGradient}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="2xl"
            px={10}
            pb={10}
            w="460px"
            maxW="90vw"
          >
            <Center fontSize="xl" fontWeight="semibold" py={6}>
              Login to Your Account
            </Center>

            <Flex
              align="center"
              justify="center"
              border="1px"
              borderColor={borderColor}
              rounded="md"
              py={2}
              px={4}
              mb={4}
              cursor="pointer"
              _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
              onClick={googleLogin}
            >
              <img src={google} alt="google" width="20px" style={{ marginRight: "10px" }} />
              <Text fontSize="md" color={subTextColor}>
                Login with Google
              </Text>
            </Flex>

            <Center fontSize="sm" my={2}>
              OR
            </Center>

            <InputGroup mb={4}>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                variant="filled"
                type="email"
              />
            </InputGroup>

            <InputGroup mb={4} >
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  variant="filled"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="link"
                  />
                </InputRightElement>
              </InputGroup>

            <Button
              w="full"
              py={5}
              fontSize="sm"
              mt={2}
              bgGradient="linear(to-r, blue.600, blue.800)"
              color="white"
              _hover={{ opacity: 0.9 }}
              onClick={handleSubmit}
            >
              Welcome Back
            </Button>

            <Text mt={4} fontSize="md" color={subTextColor} textAlign="center">
              Don’t have an account?{" "}
              <Text
                as="span"
                color={linkColor}
                cursor="pointer"
                fontWeight="medium"
                onClick={() => navigateTo("/signup")}
              >
                Sign Up
              </Text>
            </Text>
          </Box>
        </AbsoluteCenter>
      </Box>

      <Center bg={footerBg} py={2}>
        <Text fontSize="xs" color={footerColor}>
          © 2025 Year. All rights reserved.
        </Text>
      </Center>
    </Box>
  );
};

export default Login;
