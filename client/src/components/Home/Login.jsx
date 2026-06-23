import {
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
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/study-logo.png";
import google from "../../assets/Frame.png";
import ColorModeButton from "../Misc/ColorToggle";
import api from "../../api/axios";

const Login = () => {
  const navigateTo = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const bgGradient = useColorModeValue("linear(to-br, gray.50, gray.100)", "linear(to-br, gray.900, gray.800)");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const linkColor = useColorModeValue("blue.600", "blue.400");
  const bgColor = useColorModeValue("white", "gray.800");
  const footerBg = useColorModeValue("gray.100", "gray.900");
  const footerColor = useColorModeValue("gray.500", "gray.400");
  const iconHoverBg = useColorModeValue("gray.200", "gray.700");
  const textModeColor = useColorModeValue("blue.800", "whiteAlpha.900");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get("/api/user/me");

        localStorage.setItem(
          "userInfo",
          JSON.stringify(data)
        );

        toast({
          title: "You're already logged in.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });

        navigateTo("/home");
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth();
  }, [navigateTo, toast]);

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const { data: userData } = await api.post("/api/user/google-login", {
          access_token
        });

        localStorage.setItem("userInfo", JSON.stringify(userData));

        toast({
          title: "Logged in with Google!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigateTo("/home");
      } catch (error) {
        toast({
          title: "Google login failed.",
          description: error?.response?.data?.detail || "Something went wrong.",
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

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();

      if (!email || !password) {
        toast({
          title: "Missing fields",
          description: "Please fill out all fields.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      setLoading(true);

      try {
        const { data } = await api.post(
          "/api/user/login",
          { email, password },
        );

        localStorage.setItem("userInfo", JSON.stringify(data));

        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        navigateTo("/home");
      } catch (error) {
        toast({
          title: "Login Failed",
          description: error.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [email, password, loading, toast, navigateTo]
  );

  return (
    <Box bg={bgColor} color={textColor} minH="100vh" display="flex" flexDirection="column">
      <Flex color={footerColor} bg={footerBg} py={2} px={4} align="center">
        <Text
          fontSize="3xl"
          fontWeight="bold"
          textAlign="center"
          className="bg-gradient-to-b from-[#57a0e9] to-[#212b35] bg-clip-text text-transparent"
        >
          MindTube
        </Text>
        <Flex flex="1" justify="center">
          <img src={logo} alt="logo" />
        </Flex>
        <Box w="40px" />
        <ColorModeButton />
      </Flex>

      <Box flex="1" position="relative" display="flex" alignItems="center" justifyContent="center">
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
          <Center fontSize="xl" fontWeight="semibold" py={6} color={textModeColor}>
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
            _hover={{ bg: iconHoverBg, transform: "scale(1.05)", transition: "all 0.2s ease" }}
            onClick={googleLogin}
          >
            <img src={google} alt="google" width="20px" style={{ marginRight: "10px" }} />
            <Text fontSize="md" color={subTextColor}>
              Login with Google
            </Text>
          </Flex>

          <Center fontSize="sm" my={2} fontWeight={"bold"}>
            OR
          </Center>

          <InputGroup mb={4}>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
              type="email"
              variant="filled"
              transition="all 0.2s ease"
              _hover={{ transform: "scale(1.02)" }}
              _focus={{ transform: "scale(1.02)" }}
            />
          </InputGroup>

          <InputGroup mb={4}>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              variant="filled"
              transition="all 0.2s ease"
              _hover={{ transform: "scale(1.02)" }}
              _focus={{ transform: "scale(1.02)" }}
            />
            <InputRightElement>
              <IconButton
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle Password"
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
            transition="all 0.2s ease"
            _hover={{ opacity: 0.9, transform: "scale(1.05)" }}
            onClick={handleLogin}
            isLoading={loading}
          >
            Welcome Back
          </Button>

          <Text mt={4} fontSize="md" color={subTextColor} textAlign="center">
            Don't have an account?{" "}
            <Text
              as="span"
              color={linkColor}
              cursor="pointer"
              fontWeight="medium"
              transition="all 0.2s ease"
              _hover={{ textDecoration: "underline" }}
              onClick={() => navigateTo("/signup")}
            >
              Sign Up
            </Text>
          </Text>
        </Box>
      </Box>

      <Center bg={footerBg} py={2}>
        <Text fontSize="xs" color={footerColor}>
          © 2026 Year. All rights reserved.
        </Text>
      </Center>
    </Box>
  );
};

export default Login;
