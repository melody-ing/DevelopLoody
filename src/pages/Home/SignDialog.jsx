import { useState } from "react";
import styled from "styled-components";
import theme from "../../components/css/theme";
import { useNavigate } from "react-router-dom";
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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/utils/firebase";
import { toast } from "react-toastify";

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

  ${theme.breakpoints.xs} {
    position: absolute;
    right: 4rem;
    top: 20rem;
    width: 16rem;
  }

  ${theme.breakpoints.xxs} {
    position: static;
  }
`;

const WrapDialogContent = styled(DialogContent)`
  width: 55rem;
  text-align: left;
  display: flex;
  justify-content: center;
  background-color: #ffffff00;
  border: none;

  ${theme.breakpoints.sm} {
    width: 90%;
  }
`;

const AccountError = styled.p`
  color: ${theme.colors.danger};
  height: 1rem;
`;

const SignDialog = () => {
  const navigate = useNavigate();
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputName, setInputName] = useState("");
  const [isLoginError, setIsLoginError] = useState(false);
  const [isRegisterError, setIsRegisterError] = useState(false);

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
        toast.warn(`初次見面${inputName}`);
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          setIsRegisterError(true);
        }
      });
  }

  async function handleLogin() {
    signInWithEmailAndPassword(auth, inputEmail, inputPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = getFireStore("users", user.uid);
        setIsLoginError(false);
        return userData;
      })
      .then((userData) => {
        navigate(`/dashboard`);

        toast.warn(`${userData.name}你好`);
      })
      .catch(() => {
        setIsLoginError(true);
      });
  }

  function handleAuthState() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate(`/dashboard`);
      }
    });
  }

  return (
    <Dialog
      onOpenChange={(e) => {
        if (e === true) return;
        setIsLoginError(false);
        setIsRegisterError(false);
        handleEmptyInput();
      }}
    >
      <DialogTrigger>
        {" "}
        <Login onClick={handleAuthState}>製作 Loody</Login>
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
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
                    <Input
                      type="password"
                      className="text-[1.6rem] h-[5rem] small:text-[1.4rem] small:h-[4rem]"
                      id="password"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="text-[2.4rem] h-[5rem] w-[100%] mt-20 small:mt-10 small:h-[4rem] small:text-[2rem]">
                    登入
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form
              action=""
              onSubmit={(e) => {
                handleRegister();
                e.preventDefault();
              }}
            >
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
                    <Input
                      type="password"
                      className="text-[1.6rem] h-[5rem] small:text-[1.4rem] small:h-[4rem]"
                      id="password"
                      value={inputPassword}
                      onChange={(e) => setInputPassword(e.target.value)}
                      required
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
                  <Button className="text-[2.4rem] h-[5rem] w-[100%] mt-20  small:mt-10 small:h-[4rem] small:text-[2rem]">
                    註冊
                  </Button>
                </CardFooter>
              </Card>{" "}
            </form>
          </TabsContent>
        </Tabs>
      </WrapDialogContent>
    </Dialog>
  );
};

export default SignDialog;
