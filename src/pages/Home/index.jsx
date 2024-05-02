import React, { useState } from "react";
import styled from "styled-components";
import PrimaryBg from "../../components/css/PrimaryBg";
import theme from "../../components/css/theme";
import { useNavigate } from "react-router-dom";
import { useGetRealTime } from "../../utils/hook/useGetRealTime";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getFireStore, setFireStore } from "@/utils/reviseFireStore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { app } from "@/utils/firebase";
import { v4 as uuidv4 } from "uuid";
import { Slide, toast } from "react-toastify";
import { Password } from "primereact/password";
const auth = getAuth(app);

const WrapHome = styled(PrimaryBg)`
  display: flex;
  flex-direction: column;
`;

const Logo = styled.img`
  margin-top: 12rem;
  width: auto;
  height: 7rem;

  ${theme.breakpoints.sm} {
    height: 6rem;
  }
`;

const Entry = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 15rem;
  width: 30rem;
  margin-bottom: 1.2rem;
  border-radius: 10px;

  ${theme.breakpoints.sm} {
    width: 26rem;
  }
`;

const InputPin = styled.input`
  height: 6rem;
  width: 85%;
  border: 1px solid #ccc;
  margin-top: 2rem;
  border-radius: 10px;
  background-color: ${theme.colors.light};
  color: ${theme.colors.tertiary};
  font-size: larger;
  padding: 0 2rem;
  text-align: center;
  border: none;
  box-shadow: ${theme.shadow};

  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #a9a7a7;
  }
`;

const WrapButton = styled.button`
  background-color: ${theme.colors.dark};
  font-size: larger;
  color: ${theme.colors.light};
  margin-top: 1.6rem;
  width: 85%;
  height: 5rem;
  border-radius: 10px;
  box-shadow: ${theme.shadow};
  border: none;
  cursor: pointer;

  p {
    letter-spacing: 2rem;
    transform: translate(1rem);
  }
`;

const Login = styled.p`
  color: ${theme.colors.secondary};
  text-decoration: underline;
  cursor: pointer;
`;

const WrapPassword = styled(Password)`
  border: 1px solid rgb(226, 232, 240);
  outline: none;
  display: flex;
  align-items: center;
  border-radius: 3px;
  padding: 0 1rem;

  input {
    border: none;
    letter-spacing: 0.2px;

    &:focus {
      border: none;
      outline: none;
    }
  }
`;

const WrapDialog = styled(Dialog)``;

const WrapDialogContent = styled(DialogContent)`
  width: 55rem;
  text-align: left;
  display: flex;
  justify-content: center;
  background-color: #ffffff00;
  border: none;

  ${theme.breakpoints.sm} {
    width: 32rem;
  }
`;

const AccountError = styled.p`
  color: ${theme.colors.danger};
  height: 1rem;
`;

const Home = () => {
  const navigate = useNavigate();
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputPin, setInputPin] = useState("");
  const [isLoginError, setIsLoginError] = useState(false);
  const [isRegisterError, setIsRegisterError] = useState(false);

  const {
    data: realTime,
    isError: isRTError,
    isLoading: isRTLoading,
  } = useGetRealTime();
  function handlePart() {
    const room =
      realTime &&
      Object.values(realTime).filter((data) => data.pin === `${inputPin}`);

    if (room.length > 0) {
      navigate(`/part/${room[0].id}/${inputPin} `);
    }
  }

  function handleEmptyInput() {
    setInputEmail("");
    setInputPassword("");
    setInputName("");
  }

  function handleRegister() {
    createUserWithEmailAndPassword(auth, inputEmail, inputPassword)
      .then((userCredential) => {
        // Signed up
        const userId = uuidv4();
        const user = userCredential.user;

        updateProfile(user, {
          displayName: inputName,
        });
        setFireStore("users", auth.currentUser.uid, {
          email: inputEmail,
          name: inputName,
          uid: auth.currentUser.uid,
          userId,
        });
        toast.warn(`初次見面${inputName}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          icon: false,
          transition: Slide,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(errorCode, errorMessage);
        if (errorCode === "auth/email-already-in-use") {
          setIsRegisterError(true);
        }
      });
  }

  async function handleLogin() {
    signInWithEmailAndPassword(auth, inputEmail, inputPassword)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        const userData = getFireStore("users", user.uid);
        setIsLoginError(false);
        return userData;
      })
      .then((userData) => {
        navigate(`/dashboard`);

        toast.warn(`${userData.name}你好`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          icon: false,
          transition: Slide,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setIsLoginError(true);
      });
  }

  function handleAuthState() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        navigate(`/dashboard`);
        console.log("User is signed in");
      } else {
        console.log("User is not signed in");
      }
    });
  }

  return (
    <WrapHome>
      <Logo src="logo.png" alt="" />
      <Entry>
        <InputPin
          placeholder="遊戲pin碼"
          value={inputPin}
          onChange={(e) => setInputPin(e.target.value)}
        />
        <WrapButton onClick={handlePart} size="large">
          <p>進入</p>
        </WrapButton>
      </Entry>
      <WrapDialog
        onOpenChange={(e) => {
          if (e === true) return;
          setIsLoginError(false);
          setIsRegisterError(false);
          handleEmptyInput();
        }}
      >
        <DialogTrigger>
          {" "}
          <Login onClick={handleAuthState}>製作自己的Loody</Login>
        </DialogTrigger>
        <WrapDialogContent>
          <Tabs
            defaultValue="login"
            className="w-[500px]"
            onValueChange={handleEmptyInput}
          >
            <TabsList className="grid w-full grid-cols-2 h-[5.6rem] ">
              <TabsTrigger
                className="h-[5rem] text-4xl small:text-3xl"
                value="login"
              >
                登入
              </TabsTrigger>
              <TabsTrigger
                className="h-[5rem] text-4xl small:text-3xl"
                value="register"
              >
                註冊
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[3.2rem] my-10  small:text-[2.4rem] small:my-2">
                    已經有帳號了嗎?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-10 small:space-y-5">
                  <AccountError>
                    {isLoginError && "帳號或密碼輸入錯誤"}
                  </AccountError>
                  <div className="space-y-2 ">
                    <Label
                      className=" text-[1.6rem] small:text-[1.4rem]"
                      htmlFor="email"
                    >
                      電子信箱
                    </Label>
                    <Input
                      type="email"
                      className="text-[1.6rem] h-[5rem] small:text-[1.4rem] small:h-[4rem]"
                      id="email"
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <Label
                      className=" text-[1.6rem] small:text-[1.4rem]"
                      htmlFor="password"
                    >
                      密碼
                    </Label>
                    <WrapPassword
                      className="text-[1.6rem] h-[5rem] small:text-[1.4rem] small:h-[4rem] "
                      id="password"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      required
                      feedback={false}
                      tabIndex={1}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleLogin}
                    className="text-[2.4rem] h-[5rem] w-[100%] mt-20 small:mt-10 small:h-[4rem] small:text-[2rem]"
                  >
                    登入
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="register">
              <form action="" onSubmit={(e) => e.preventDefault()}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[3.2rem] my-10 small:text-[2.4rem] small:my-0 ">
                      感謝你的註冊呦
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-10 small:space-y-6">
                    <AccountError>
                      {isRegisterError && "此帳號已註冊"}
                    </AccountError>
                    <div className="space-y-2">
                      <Label
                        className=" text-[1.6rem] small:text-[1.4rem]"
                        htmlFor="email"
                      >
                        電子信箱
                      </Label>
                      <Input
                        className="text-[1.6rem] h-[5rem] small:text-[1.4rem] small:h-[4rem]"
                        id="email"
                        type="email"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        title="email不符合格式"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        className=" text-[1.6rem] small:text-[1.4rem]"
                        htmlFor="password"
                      >
                        密碼
                      </Label>
                      <WrapPassword
                        className="text-[1.6rem] h-[5rem] small:text-[1.4rem] small:h-[4rem] "
                        id="password"
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                        pattern="^[\da-zA-Z]{6,}$"
                        title="密碼必須大於6位且只能包含數字和英文字母"
                        required
                        feedback={false}
                        tabIndex={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        className=" text-[1.6rem] small:text-[1.4rem]"
                        htmlFor="name"
                      >
                        使用者名稱
                      </Label>
                      <Input
                        className="text-[1.6rem] h-[5rem] small:text-[1.4rem] small:h-[4rem]"
                        id="name"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        pattern="^.{2,}$"
                        title="使用者名稱必須大於2個字"
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="text-[2.4rem] h-[5rem] w-[100%] mt-20  small:mt-10 small:h-[4rem] small:text-[2rem]"
                      onClick={handleRegister}
                    >
                      註冊
                    </Button>
                  </CardFooter>
                </Card>{" "}
              </form>
            </TabsContent>
          </Tabs>
        </WrapDialogContent>
      </WrapDialog>
    </WrapHome>
  );
};

export default Home;
