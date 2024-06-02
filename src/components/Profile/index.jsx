import Buttons from "@/components/Buttons";
import theme from "@/components/css/theme";
import {
  AvatarFallback,
  AvatarImage,
  Avatar as ComAvatar,
} from "@/components/ui/avatar";
import { auth } from "@/utils/firebase";
import {
  useGetFireStore,
  useGetFireStores,
} from "@/utils/hook/useGetFireStore";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";
import { signOut } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Box from "./svg/Box";
import Bars from "./svg/Bars";

const Header = styled.div`
  width: 100vw;
  height: 5rem;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${theme.colors.primary};
  display: none;
  z-index: 10;

  ${theme.breakpoints.sm} {
    display: block;
  }
`;

const slideDown = keyframes`
  from {
    max-height: 0;
  }
  to {
    max-height: 36vh;
  }
`;

const slideUp = keyframes`
  from {
    max-height: 36vh;
  }
  to {
    max-height: 0;
  }
`;

const WarpProfile = styled.div`
  background-color: ${theme.colors.primary};
  height: 100vh;
  width: 22rem;
  text-align: left;
  box-shadow: 0px 3px 3px 3px #ccc;
  position: relative;
  padding-top: 1.4rem;
  overflow: hidden;

  ${theme.breakpoints.sm} {
    width: 100vw;
    position: fixed;
    height: auto;
    top: 0;
    left: 0;
    margin-top: 3rem;
    box-shadow: 0px 2px 5px 3px #5757574c;
    transition: visibility 0.5s ease;
    animation: ${({ $isMenuOpen }) => ($isMenuOpen ? slideDown : slideUp)} 0.5s
      ease forwards;
    visibility: ${({ $isMenuOpen }) => ($isMenuOpen ? "visible" : "hidden")};
  }
`;

const WrapHeaderLogo = styled.div`
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

  ${theme.breakpoints.sm} {
    img {
      margin-top: 1rem;
      height: 3.4rem;
    }
  }
`;

const WrapBars = styled.div`
  position: absolute;
  top: 2.5rem;
  transform: translate(0, -50%);
  left: 2rem;
  cursor: pointer;
  padding: 0.5rem;

  &:hover {
    background-color: #ac9f834d;
    border-radius: 5px;
  }
`;

const WrapLogo = styled(WrapHeaderLogo)`
  ${theme.breakpoints.sm} {
    display: none;
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

  ${theme.breakpoints.sm} {
    margin: 0.6rem;
  }
`;

const WrapPages = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;

  ${theme.breakpoints.sm} {
    margin-left: 0;
  }
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

  ${theme.breakpoints.sm} {
    margin: 0;
    border-radius: 0;
    padding: 1rem 2rem;
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

  ${theme.breakpoints.sm} {
    top: 4.4rem;
    right: 2rem;
    left: auto;
  }
`;

const Profile = () => {
  const param = location.pathname;

  const [isLogoutBtn, setIsLogoutBtn] = useState(false);
  const [uid, setUid] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const menuRef = useRef(null);

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
      })
      .catch(() => {
        navigate("/");
      });
  }

  function handleMenuClick() {
    setIsMenuOpen(!isMenuOpen);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return usersIsLoading || userIsLoading || shareIsLoading ? (
    <WarpProfile>
      {" "}
      <WrapUserInfo></WrapUserInfo>
      <SheetHr />
    </WarpProfile>
  ) : (
    <div ref={menuRef}>
      <Header>
        {" "}
        <WrapHeaderLogo>
          <img src="/logo.png" onClick={() => navigate("/")} />
          <WrapBars onClick={handleMenuClick}>
            <Bars />
          </WrapBars>
        </WrapHeaderLogo>
      </Header>
      <WarpProfile $isMenuOpen={isMenuOpen}>
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
        </WrapPages>
        <Logout onClick={handleLogout}>
          <Buttons size="small">登出</Buttons>
        </Logout>
      </WarpProfile>
    </div>
  );
};

export default Profile;
{
  /* <Page
          $param={param}
          $page="/setting"
          onClick={() => navigate("/dashboard")}
        >
          <Setting />
          <p>設定</p>
        </Page> */
}
