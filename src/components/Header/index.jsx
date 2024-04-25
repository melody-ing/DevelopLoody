import React, { useState } from "react";
import theme from "../css/theme";
import styled from "styled-components";
import UserIcon from "./UserIcon";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { app } from "@/utils/firebase";

const auth = getAuth(app);

const WarpHeader = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.primary};
  /* background: linear-gradient(to bottom, ${theme.colors.primary}, #fff); */

  height: 6rem;
  justify-content: space-between;
  padding: 0 3rem;
`;

const Logo = styled.img`
  height: 4rem;
  width: auto;
  cursor: pointer;
`;

const Logout = styled.div`
  position: absolute;
  right: 1rem;
  top: 5rem;
  background-color: #996484;
  color: ${theme.colors.light};
  border-radius: 5px;
  padding: 1rem 2rem;
  cursor: pointer;
`;

const Header = ({ children }) => {
  const [isLogoutBtn, setIsLogoutBtn] = useState(false);

  const navigate = useNavigate();
  function handleHome() {
    navigate("/");
  }

  function handleUserBtn() {
    setIsLogoutBtn(!isLogoutBtn);
  }

  function handleLogout() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
        console.log("Sign-out successful");
      })
      .catch((error) => {
        // An error happened.
        console.log("Sign-out error");
      });
  }

  return (
    <WarpHeader>
      <Logo src="/logo.png" alt="" onClick={handleHome} />
      {children}
      {/* <Buttons>登入</Buttons> */}
      <div onClick={handleUserBtn}>
        <UserIcon />
      </div>
      {isLogoutBtn && <Logout onClick={handleLogout}>登出</Logout>}
    </WarpHeader>
  );
};

export default Header;
