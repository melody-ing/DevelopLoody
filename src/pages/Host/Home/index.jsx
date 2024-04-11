import React, { useEffect, useState } from "react";
import { database } from "../../../utils/firebase";
import { onValue, ref } from "firebase/database";
import PrimaryBg from "../../../components/css/PrimaryBg";
import { styled } from "styled-components";
import theme from "../../../components/css/theme";
import Buttons from "../../../components/Buttons";
import { Link } from "react-router-dom";

const WrapHome = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
`;

const Logo = styled.img`
  height: 6rem;
  width: auto;
`;

const JoinCode = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  gap: 2rem;

  img {
    width: 8rem;
    height: 8rem;
  }
`;

const WrapCode = styled.div`
  background-color: ${theme.colors.light};
  height: 8rem;
  width: 30rem;
  text-align: left;
  div {
    padding: 0 2rem;
    height: 3.6rem;
  }
  p {
    padding: 0 2rem;
    font-size: 6rem;
  }
`;

const Participants = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 2rem;
  line-height: 3rem;
  height: auto;
  width: auto;
  font-size: 2.4rem;

  p {
    padding: 1rem;
    background-color: ${theme.colors.light};
  }
`;

const Attenance = styled.div`
  position: absolute;
  bottom: 4rem;
  left: 4rem;
  padding: 2rem;
  background-color: ${theme.colors.tertiary}66;
  color: ${theme.colors.light};
  font-size: 3rem;
  width: 8rem;
  height: 8rem;
  line-height: 4rem;
`;

const StartBtn = styled.div`
  position: absolute;
  bottom: 4rem;
  right: 4rem;
`;

const Home = () => {
  function handleStart() {
    console.log("handleStart called");
  }

  return (
    <WrapHome>
      {" "}
      <Logo src="title.png" alt="" />
      <JoinCode>
        <WrapCode>
          <div>遊戲PIN碼：</div>
          <p>750331</p>
        </WrapCode>
        <img src="qrcode.png" alt="" />
      </JoinCode>
      <Participants>
        <p>Melody</p>
        <p>Melody</p>
        <p>Melody</p>
        <p>Melody</p>
        <p>Melody</p>
        <p>Melody</p>
        <p>Melody</p>
        <p>Melody</p>
        <p>Melody</p>
        <p>Melody</p>
      </Participants>
      <Attenance>12</Attenance>
      <StartBtn>
        <Link to="/host/game">
          <Buttons size="large">開始</Buttons>
        </Link>
      </StartBtn>
      {/* {allUser?.map((user) => {
    if (user.selected) {
      return (
        <div key={user.id}>
          <span>{user.name}</span>
          {"  "}
          <span style={{ color: "red" }}>
            {user.selected === "C" ? "Correct" : "Incorrect"}
          </span>
        </div>
      );
    }
  })} */}
    </WrapHome>
  );
};

export default Home;
