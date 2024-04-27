import React, { useEffect, useState } from "react";
import PrimaryBg from "../../components/css/PrimaryBg";
import theme from "../../components/css/theme";
import Buttons from "../../components/Buttons";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import { useGameStore } from "../../utils/hook/useGameStore";
import { updateRealTime } from "../../utils/reviseRealTime";
import { QRCodeCanvas } from "qrcode.react";
import { useGetRealTime } from "../../utils/hook/useGetRealTime";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/utils/firebase";

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
  const navigate = useNavigate();
  const { setEventData, setQbankData } = useGameStore();

  const { pin: getUrlPin, documentId: getUrlDocumentId } = useParams();
  const {
    data: realTimeData,
    isError: isRTError,
    isLoading: isRTLoading,
  } = useGetRealTime();
  const eventData = realTimeData?.[getUrlDocumentId];
  const { users = {} } = eventData || {};
  console.log(eventData);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("User is signed in");
      } else {
        console.log("User is not signed in");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (eventData) {
      setEventData(eventData);
    }
  }, [eventData]);

  function handleState() {
    updateRealTime(getUrlDocumentId, { state: "game" });
    navigate(`/host/game/${getUrlDocumentId}`);
  }

  return (
    <WrapHost>
      <WrapHome>
        {" "}
        <Logo src="logo.png" alt="" />
        <JoinCode>
          <WrapCode>
            <div>遊戲PIN碼：</div>
            <p>{getUrlPin}</p>
          </WrapCode>
          <QRCodeCanvas
            value={`https://loody-ing.web.app/part/${getUrlDocumentId}/${getUrlPin}`}
            bgColor={`${theme.colors.primary}`}
            fgColor={`${theme.colors.tertiary}`}
            level={"L"}
            size={150}
          />
        </JoinCode>
        <Participants>
          {Object.values(users)?.map((user, index) => (
            <p key={index}>{user.name}</p>
          ))}
        </Participants>
        {users && <Attenance>{Object.keys(users).length}</Attenance>}
        {Object.keys(users).length !== 0 && (
          <StartBtn onClick={handleState}>
            <Buttons>開始</Buttons>
          </StartBtn>
        )}
      </WrapHome>
    </WrapHost>
  );
};

export default Host;
