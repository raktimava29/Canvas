import { AbsoluteCenter, Box, Button, Center, Flex,Fieldset } from "@chakra-ui/react";
import logo from "../../assets/icons8-study-smarter-64.png"
import google from "../../assets/Frame.png";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Field } from "@chakra-ui/react";
import { Input, InputGroup } from "@chakra-ui/react"
import { LuUser } from "react-icons/lu"
import { PasswordInput } from "@/components/ui/password-input"

function Signup() {
  const navigateTo = useNavigate();

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");

  const personInfo = JSON.parse(localStorage.getItem('user'));

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios
        .get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => res.data);

      console.log(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      navigateTo('/google-login');
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const handleSubmit = () => {
    console.log("user : ", username);
    console.log("user : ", email);
    console.log("user : ", password);
  }


  return (
    <div className="bg-black font-openSans">
      <Center className="border-b-[1px] border-[#25262B] py-2">
        <img src={logo} alt="logo" />
      </Center>
      <Box className="h-[83.7vh]">
        <AbsoluteCenter>
          <Flex
            direction="column"
            style={{
              background:
                'linear-gradient(138.97deg, #111214 5.16%, #121212 105.18%)',
            }}
            spaceY="18px"
            paddingX="40px"
            paddingBottom="40px"
            className="border-[1px] rounded-2xl border-[#343A40] h-[430px] w-[460px]"
          >
          
            {personInfo ? (
              <Box>
                <Center className="font-semibold p-[24px] text-xl text-white">
                  You are already logged in.
                </Center>
                <Flex justify="center" className="text-white">
                  <p>You are already signed in with Google.</p>
                </Flex>
              </Box>
            ) : (
              <>
                <Box>
                  <Center className="font-semibold p-[24px] text-xl text-white">
                    Create a New Account
                  </Center>
                  <Field.Root required>
                <Field.Label></Field.Label>
                <InputGroup startElement={<LuUser />}>
                <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Username" />
                </InputGroup>
            </Field.Root>
                  <Flex
                    spaceX="10px"
                    justify="center"
                    className="border-[1px] rounded border-[#707172] py-2 px-4 cursor-pointer mt-4"
                    onClick={() => login()}
                  >
                    <img src={google} alt="" />
                    <p className="text-base text-[#CCCCCC]">Sign Up with Google</p>
                  </Flex>
                </Box>
                <Flex justify="center" direction="column" align='center'>
                <Center className="text-sm text-white mt-[-4px]">
                  OR
                </Center>
                <Fieldset.Root size="sm">
            <Field.Root required>
                <Field.Label></Field.Label>
                <Input 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Provide your Email" />
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
                        'linear-gradient(91.73deg, #4B63DD -2.99%, rgba(5, 36, 191, 0.99) 95.8%)',
                    }}
                    onClick={handleSubmit}
                  >
                    Create an Account
                  </Button>
                  <p className="text-base text-[#909296]">
                    Already have an account?{' '}
                    <span className="text-[#C1C2C5] cursor-pointer"> Sign In</span>
                  </p>
                </Flex>
              </>
            )}
          </Flex>
        </AbsoluteCenter>
      </Box>
      <Center className="bg-[#121212]">
        <p className="text-xs font-normal border-b-[1px] border-[#25262B] py-2 text-[#5C5F66]">
          © 2025 Year. All rights reserved.
        </p>
      </Center>
    </div>
  );
}

export default Signup;
