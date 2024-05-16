import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { auth } from "@/utils/firebase";
import {
  Avatar as ComAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  useGetFireStore,
  useGetFireStores,
} from "@/utils/hook/useGetFireStore";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";
import theme from "@/components/css/theme";
import Buttons from "@/components/Buttons";
import { ScrollArea } from "@/components/ui/scroll-area";

import { signOut } from "firebase/auth";
import Box from "./Box";
import Setting from "./Setting";

const WarpProfile = styled(ScrollArea)`
  background-color: ${theme.colors.primary};
  height: 100vh;
  width: 22rem;
  text-align: left;
  box-shadow: 0px 3px 3px 3px #ccc;
  position: relative;
  ${theme.breakpoints.sm} {
    display: none;
  }
`;

const WrapLogo = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 10px;
  margin: 0 auto;
  cursor: pointer;

  img {
    width: auto;
    height: 4rem;
    margin: 0 auto;
    margin-top: 2.4rem;
  }
`;

const WrapAvatar = styled(ComAvatar)`
  width: 5rem;
  height: 5rem;
  border: 2px solid #cecece;
`;

const WrapUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 6rem;
  margin-top: 2rem;
  margin-left: 2rem;
`;

const UserName = styled.p`
  font-size: 1.6rem;
  margin-bottom: 0.4rem;
  word-wrap: break-word;
`;

const UserId = styled.p`
  color: #656565;
  font-size: 1.3rem;
`;

const SheetHr = styled.hr`
  border: none;
  height: 1px;
  margin: 2rem;
  background-color: #ffffff;
`;

const WrapPages = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
`;

const Page = styled.div`
  font-weight: 400;
  width: 100%;
  margin-left: 2rem;
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  cursor: pointer;
  background-color: ${({ $param, $page }) =>
    $param === $page && "rgba(193, 182, 126, 0.403)"};
  border-radius: ${({ $param, $page }) => $param === $page && "10px"};

  &:hover {
    background-color: rgba(193, 182, 126, 0.403);
    border-radius: 10px;
  }
`;

const WrapAiIcon = styled.div`
  color: #fffdee;
  background-color: #c1b67ed5;
  padding-left: 0.3rem;
  padding-right: 0.2rem;
  border-radius: 5px;
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 0.2rem;
  width: 2rem;
  line-height: 1.8rem;
`;

const Logout = styled.div`
  position: absolute;
  left: 2rem;
  bottom: 2rem;
`;

const Profile = () => {
  const param = location.pathname;

  const [isLogoutBtn, setIsLogoutBtn] = useState(false);
  const [uid, setUid] = useState(null);
  const {
    data: shareQbanks,
    isError: shareIsError,
    isLoading: shareIsLoading,
  } = useGetFireStores(`users/${uid}/share`);

  const {
    data: getUserData,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useGetFireStore("users", uid);

  const {
    data: getUsersData,
    isLoading: usersIsLoading,
    isError: usersIsError,
  } = useGetFireStores("users");

  const userUid = useOnAuthStateChange();

  useEffect(() => {
    setUid(userUid);
  }, [userUid]);

  const navigate = useNavigate();

  function handleUserBtn() {
    setIsLogoutBtn(!isLogoutBtn);
  }

  function handleLogout() {
    signOut(auth)
      .then(() => {
        navigate("/");
        // console.log("Sign-out successful");
      })
      .catch((error) => {
        // console.log("Sign-out error");
      });
  }

  return usersIsLoading || userIsLoading || shareIsLoading ? (
    <WarpProfile>
      {" "}
      <WrapUserInfo></WrapUserInfo>
      <SheetHr />
    </WarpProfile>
  ) : (
    <WarpProfile>
      <WrapLogo onClick={() => navigate("/")}>
        <img src="/logo.png" />
      </WrapLogo>

      <WrapUserInfo>
        <WrapAvatar onClick={handleUserBtn}>
          <AvatarImage src="" />
          <AvatarFallback>{getUserData?.name.slice(0, 2)}</AvatarFallback>
        </WrapAvatar>
        <div>
          <UserName>{getUserData?.name}</UserName>
          {/* <UserEmail>{getUserData?.email}</UserEmail> */}
          <UserId>id：{getUserData?.userId}</UserId>
        </div>
      </WrapUserInfo>
      <SheetHr />
      <WrapPages>
        <Page
          $param={param}
          $page="/dashboard"
          onClick={() => navigate("/dashboard")}
        >
          <Box />
          <p>所有題庫</p>
        </Page>
        <Page
          $param={param}
          $page="/aigenerate"
          onClick={() => navigate("/aigenerate")}
        >
          <WrapAiIcon>AI</WrapAiIcon>
          <p>AI生成題庫</p>
        </Page>
        <Page
          $param={param}
          $page="/setting"
          onClick={() => navigate("/dashboard")}
        >
          <Setting />
          <p>設定</p>
        </Page>
      </WrapPages>
      <Logout onClick={handleLogout}>
        <Buttons size="small">登出</Buttons>
      </Logout>
    </WarpProfile>
  );
};

export default Profile;
