import React, { useState } from "react";
import styled from "styled-components";
import PrimaryBg from "../../components/css/PrimaryBg";
import theme from "../../components/css/theme";
import { useNavigate } from "react-router-dom";
import { updateRealTime } from "../../utils/reviseRealTime";
import { useGameStore } from "../../utils/hook/useGameStore";
import { useGetRealTime } from "../../utils/hook/useGetRealTime";

const WrapHome = styled(PrimaryBg)`
  display: flex;
  flex-direction: column;
`;

const Logo = styled.img`
  margin-top: 12rem;
  width: auto;
  height: 7rem;
`;

const Entry = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 15rem;
  width: 30rem;
  margin-bottom: 1.2rem;
  border-radius: 10px;
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

  @media (max-width: ${theme.breakpoints.sm}) {
    height: 3rem;
  }
`;

const Button = styled.button`
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

const Home = () => {
  const navigate = useNavigate();
  const { setDocumentId, setUserId, userId } = useGameStore();
  const pin = Math.floor(Math.random() * 900000) + 100000;
  const [inputPin, setInputPin] = useState("");
  const temporaryId = "uRjHQ7uQS06iBADYJSSH";
  const temporaryUserId = "zv0aT3r0xQFyMx4wOIpH";
  function handleLogin() {
    setUserId(temporaryUserId);
    navigate(`/dashboard/${temporaryUserId}`);
    // setDocumentId(temporaryId);
    // navigate(`/host/${temporaryId}`);
    // updateRealTime(temporaryId, {
    //   id: temporaryId,
    //   pin: pin.toString(),
    //   question: { answer: 1, id: 0 },
    //   state: "lobby",
    //   // users: {
    //   //   flkgmjrlt54: {
    //   //     addScore: 0,
    //   //     name: "Ken",
    //   //     score: 0,
    //   //     time: "",
    //   //   },
    //   //   g4w56hb: {
    //   //     addScore: 0,
    //   //     name: "Melody",
    //   //     score: 0,
    //   //     time: "",
    //   //   },
    //   // },
    // });
  }

  const realTime = useGetRealTime();
  function handlePart() {
    const room =
      realTime &&
      Object.values(realTime).filter((data) => data.pin === `${inputPin}`);

    if (room.length > 0) {
      setDocumentId(room[0].id);
      navigate(`/part/${room[0].id} `);
    }
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
        <Button onClick={handlePart} size="large">
          <p>進入</p>
        </Button>
      </Entry>
      <Login onClick={handleLogin}>製作自己的Loody</Login>
    </WrapHome>
  );
};

export default Home;
