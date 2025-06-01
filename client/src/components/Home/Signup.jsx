import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  Flex,
  Fieldset,
  Input,
  InputGroup,
  Text
} from "@chakra-ui/react";
import logo from "../../assets/icons8-study-smarter-64.png";
import google from "../../assets/Frame.png";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Field } from "@chakra-ui/react";
import { LuUser } from "react-icons/lu";
import { PasswordInput } from "@/components/ui/password-input";
import {
  ColorModeProvider,
  ColorModeButton,
  useColorModeValue,
} from "../ui/color-mode";

const Signup = () => {
  const navigateTo = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const personInfo = JSON.parse(localStorage.getItem("user"));

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => res.data);

      localStorage.setItem("user", JSON.stringify(userInfo));
      navigateTo("/google-login");
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const handleSubmit = () => {
    console.log("user :", username);
    console.log("email :", email);
    console.log("password :", password);
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
  const bgColor = useColorModeValue("#FFFFFF", "#000000");
  const footerBg = useColorModeValue("#EDF2F7", "#121212");

  return (
    <ColorModeProvider>
      <Box className="font-openSans" bg={bgColor} color={textColor}>
        <Center className="border-b-[1px] py-2" borderColor="#25262B" w="full">
          <Box w="40px" />
          <Box flex="1" textAlign="center">
            <img src={logo} alt="logo" className="mx-auto" />
          </Box>
          <Box w="40px" marginRight="20px">
            <ColorModeButton />
          </Box>
        </Center>

        <Box className="h-[84vh]">
          <AbsoluteCenter>
            <Flex
              direction="column"
              style={{ background: bgGradient }}
              spaceY="18px"
              paddingX="40px"
              paddingBottom="40px"
              className="border-[1px] rounded-2xl"
              borderColor={borderColor}
              height="430px"
              width="460px"
            >
              <Box>
                <Center className="font-semibold p-[24px] text-xl" color={textColor}>
                  Create a New Account
                </Center>

                <Field.Root required>
                  <Field.Label />
                  <InputGroup>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                    />
                  </InputGroup>
                </Field.Root>

                <Flex
                  spaceX="10px"
                  justify="center"
                  className="border-[1px] rounded py-2 px-4 cursor-pointer mt-4"
                  borderColor={borderColor}
                  onClick={() => login()}
                >
                  <img src={google} alt="google" />
                  <p className="text-base" style={{ color: subTextColor }}>
                    Sign Up with Google
                  </p>
                </Flex>

                <Flex justify="center" direction="column" align="center">
                  <Center className="text-sm mt-[4px]" color={textColor}>
                    OR
                  </Center>

                  <Fieldset.Root size="sm">
                    <Field.Root required>
                      <Field.Label />
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Provide your Email"
                      />
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label />
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
                    Create an Account
                  </Button>

                  <Text className="text-base" style={{ color: subTextColor }}>
                    Already have an account?{" "}
                    <span
                        className="cursor-pointer"
                        style={{ color: linkColor }}
                        onClick={() => navigateTo("/login")}
                    >
                        Sign In
                    </span>
                    </Text>
                </Flex>
              </Box>
            </Flex>
          </AbsoluteCenter>
        </Box>

        <Center bg={footerBg}>
          <p className="text-xs font-normal py-2" style={{ color: footerColor }}>
            © 2025 Year. All rights reserved.
          </p>
        </Center>
      </Box>
    </ColorModeProvider>
  );
};

export default Signup;
