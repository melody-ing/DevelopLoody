import React from "react";
import PrimaryBg from "../../components/css/PrimaryBg";
import theme from "../../components/css/theme";
import Buttons from "../../components/Buttons";
import { Link } from "react-router-dom";
import { styled } from "styled-components";
import { useGetRealTime } from "../../utils/hook/useGetRealTime";
import { useGameStore } from "../../utils/hook/useGameStore";
import { updateRealTime } from "../../utils/reviseRealTime";

const WrapHost = styled(PrimaryBg)`
  display: flex;
  flex-direction: column;
`;

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

const Host = () => {
  const { userId, documentId } = useGameStore();
  const realTime = useGetRealTime(`${documentId}/users`);
  const users = realTime && Object.values(realTime);

  function handleState() {
    updateRealTime(documentId, { state: "game" });
  }

  return (
    <WrapHost>
      <WrapHome>
        {" "}
        <Logo src="logo.png" alt="" />
        <JoinCode>
          <WrapCode>
            <div>遊戲PIN碼：</div>
            <p>750331</p>
          </WrapCode>
          <img src="qrcode.png" alt="" />
        </JoinCode>
        <Participants>
          {users?.map((user, index) => (
            <p key={index}>{user.name}</p>
          ))}
        </Participants>
        <Attenance>12</Attenance>
        <StartBtn onClick={handleState}>
          <Link to="/host/game">
            <Buttons size="large">開始</Buttons>
          </Link>
        </StartBtn>
      </WrapHome>
    </WrapHost>
  );
};

export default Host;
