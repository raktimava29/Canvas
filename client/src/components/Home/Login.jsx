import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react";
import logo from "../../assets/icons8-study-smarter-64.png";
import google from "../../assets/Frame.png";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import {
  ColorModeProvider,
  ColorModeButton,
  useColorModeValue,
} from "../ui/color-mode";
import { Fieldset, Field } from "@chakra-ui/react";

const Login = () => {
  const navigateTo = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const personInfo = JSON.parse(localStorage.getItem("user"));

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios
          .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          })
          .then((res) => res.data);
        console.log(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
        navigateTo("/dashboard");
      } catch (err) {
        console.error("Fetching Google user info failed", err);
      }
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
    },
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      navigateTo("/");
    } catch (err) {
      console.error("Login failed", err);
    }
  };
  
  const bgGradient = useColorModeValue(
    "linear-gradient(138.97deg, #F7FAFC 5.16%, #EDF2F7 105.18%)",
    "linear-gradient(138.97deg, #111214 5.16%, #121212 105.18%)" 
  );

  const borderColor = useColorModeValue("#CBD5E0", "#343A40");
  const textColor = useColorModeValue("#1A202C", "#FFFFFF");
  const subTextColor = useColorModeValue("#4A5568", "#CCCCCC");
  const linkColor = useColorModeValue("#2B6CB0", "#2B6CB0");
  const footerColor = useColorModeValue("#A0AEC0", "#5C5F66");

  return (
    <ColorModeProvider>
      <Box className="font-openSans" color={textColor} style={{ backgroundColor: useColorModeValue("#FFFFFF", "#000000") }}>
        <Center className="border-b-[1px] border-[#25262B] py-2" width="full">
            <Box w="40px" />
            <Box flex="1" textAlign="center">
                <img src={logo} alt="logo" className="mx-auto" />
            </Box>
            <Box w="40px" marginRight='20px'>
                <ColorModeButton />
            </Box>
        </Center>
        <Box className="h-[83.8vh]">
          <AbsoluteCenter>
            <Flex
              direction="column"
              style={{ background: bgGradient }}
              spaceY="18px"
              paddingX="40px"
              paddingBottom="40px"
              className="border-[1px] rounded-2xl"
              borderColor={borderColor}
              height="380px"
              width="460px"
            >
              {personInfo ? (
                <Box>
                  <Center className="font-semibold p-[24px] text-xl" color={textColor}>
                    You are already logged in.
                  </Center>
                  <Flex justify="center" color={textColor}>
                    <p>You are already signed in with Google.</p>
                  </Flex>
                </Box>
              ) : (
                <Box>
                  <Center className="font-semibold p-[24px] text-xl" color={textColor}>
                    Sign In to Your Account
                  </Center>

                  <Flex
                    spaceX="10px"
                    justify="center"
                    className="border-[1px] rounded py-2 px-4 cursor-pointer mt-4"
                    borderColor={borderColor}
                    onClick={() => login()}
                  >
                    <img src={google} alt="google" />
                    <p className="text-base" style={{ color: subTextColor }}>
                      Sign in with Google
                    </p>
                  </Flex>

                  <Flex justify="center" direction="column" align="center">
                    <Center className="text-sm mt-[4px]" color={textColor}>
                      OR
                    </Center>

                    <Fieldset.Root size="sm">
                      <Field.Root required>
                        <Field.Label></Field.Label>
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your Email"
                        />
                      </Field.Root>

                      <Field.Root required>
                        <Field.Label></Field.Label>
                        <PasswordInput
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                        />
                      </Field.Root>
                    </Fieldset.Root>

                    <Button
                      paddingY="13px"
                      paddingX="35px"
                      className="text-sm"
                      marginY="20px"
                      style={{
                        background:
                          "linear-gradient(91.73deg, #4B63DD -2.99%, rgba(5, 36, 191, 0.99) 95.8%)",
                      }}
                      onClick={handleSubmit}
                    >
                      Login
                    </Button>

                    <Text className="text-base" style={{ color: subTextColor }}>
                      Don’t have an account?{" "}
                      <span
                        className="cursor-pointer"
                        style={{ color: linkColor }}
                        onClick={() => navigateTo("/signup")}
                      >
                        Sign Up
                      </span>
                    </Text>
                  </Flex>
                </Box>
              )}
            </Flex>
          </AbsoluteCenter>
        </Box>

        <Center style={{ backgroundColor: useColorModeValue("#EDF2F7", "#121212") }}>
          <Text className="text-xs font-normal py-2" style={{ color: footerColor }}>
            © 2025 Year. All rights reserved.
          </Text>
        </Center>
      </Box>
    </ColorModeProvider>
  );
};

export default Login;
