import React, { useState } from "react";
import styled from "styled-components";
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
import { Slide, toast } from "react-toastify";
import { Password } from "primereact/password";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import "../../components/css/swiper.css";
import HomeBg from "@/components/css/HomeBg";
const auth = getAuth(app);

const WrapHome = styled.div``;

const WrapLeft = styled.div`
  position: absolute;
  left: 20rem;
  top: 45vh;
  transform: translate(0, -50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1.5rem;
`;

const WrapBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* background-color: #ebdb86; */
  z-index: -1;
`;

const Logo = styled.img`
  width: auto;
  height: 7rem;

  ${theme.breakpoints.sm} {
    height: 6rem;
  }
`;

const Slogan = styled.div`
  text-align: start;
  font-size: 2rem;
  width: 30rem;
  line-height: 3rem;
`;

const WrapButton = styled.div`
  background-color: ${theme.colors.secondary};
  font-size: 1.8rem;
  color: ${theme.colors.light};
  margin-top: 1.6rem;
  line-height: 5rem;
  width: 22rem;
  height: 5rem;
  border-radius: 10px;
  box-shadow: ${theme.shadow};
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.tertiary};
  }
`;

const Login = styled.div`
  border: 2px solid ${theme.colors.secondary};
  font-size: 1.6rem;
  font-weight: 600;
  color: ${theme.colors.secondary};
  width: 22rem;
  height: 5rem;
  line-height: 4.8rem;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    /* text-decoration: underline; */
    background-color: #9d88951a;
  }
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

const WrapDialogTrigger = styled(DialogTrigger)`
  /* outline: none;
  border: none;
  background: none;
  padding: 0; */
`;

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

const WrapRight = styled.div`
  position: absolute;
  right: 20rem;
  top: 46vh;
  transform: translate(0, -50%);
  display: flex;
  justify-content: center;
`;

const WrapDrawShape = styled.div`
  position: absolute;
  top: 8rem;
  right: -12rem;
  transform: rotate(-12deg);
`;

const DrawShape = styled.img`
  width: 40rem;
  max-width: 90rem;
`;

const WrapFlowerShape = styled.div`
  position: absolute;
  top: -14rem;
  left: -20rem;
  transform: rotate(-12deg);
`;

const FlowerShape = styled.img`
  width: 60rem;
  max-width: 90rem;
`;

const WrapSwiper = styled.div`
  width: 50rem;
  height: 32rem;
  overflow: hidden;
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
      return;
    }
    setInputPin("");
    toast.warn("無此房間", {
      position: "top-center",
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
  }

  function handleEmptyInput() {
    setInputEmail("");
    setInputPassword("");
    setInputName("");
  }

  function handleRegister() {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const passwordPattern = /^.{6,}$/;
    const namePattern = /^.{2,10}$/;
    if (!emailPattern.test(inputEmail)) {
      alert("請輸入有效的電子郵件");
      return;
    }
    if (!passwordPattern.test(inputPassword)) {
      alert("請輸入有效的密碼");
      return;
    }

    if (!namePattern.test(inputName)) {
      alert("請輸入有效的姓名");
      return;
    }

    createUserWithEmailAndPassword(auth, inputEmail, inputPassword)
      .then((userCredential) => {
        // Signed up
        const userId = Math.floor(Math.random() * 90000000) + 10000000;
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
      <HomeBg />

      <WrapLeft>
        <Logo src="logo.png" alt="" />
        <Slogan>創新學習新體驗，讓所有人一起加入學習派對！</Slogan>
        <WrapButton onClick={() => navigate("/entry")}>加入遊戲</WrapButton>
        <WrapDialog
          onOpenChange={(e) => {
            if (e === true) return;
            setIsLoginError(false);
            setIsRegisterError(false);
            handleEmptyInput();
          }}
        >
          <WrapDialogTrigger>
            {" "}
            <Login onClick={handleAuthState}>製作Loody</Login>
          </WrapDialogTrigger>
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
                        感謝您的註冊
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
                          pattern="^.{2,10}$"
                          title="使用者名稱必須大於2個字並小於10個字"
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
      </WrapLeft>
      <WrapRight>
        <WrapDrawShape>
          <DrawShape src="/draw.png" />
        </WrapDrawShape>
        <WrapFlowerShape>
          <FlowerShape src="/flower.png" />
        </WrapFlowerShape>
        <WrapSwiper>
          {" "}
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper"
          >
            <SwiperSlide></SwiperSlide>
            <SwiperSlide></SwiperSlide>
          </Swiper>
        </WrapSwiper>
      </WrapRight>
    </WrapHome>
  );
};

export default Home;
