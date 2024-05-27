import { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "../../components/css/theme";
import { useNavigate } from "react-router-dom";
import { useGetRealTime } from "../../utils/hook/useGetRealTime";
import { Slide, toast } from "react-toastify";
import HomeBg from "@/components/css/HomeBg";

const WrapHome = styled.div`
  width: 100vw;
  height: 100vh;

  padding: 4rem;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.img`
  margin-top: 12rem;
  width: auto;
  height: 7rem;
  cursor: pointer;

  ${theme.breakpoints.sm} {
    height: 6rem;
  }
`;

const EntryGame = styled.div`
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

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
  /* firefox的type="number" 設定 */
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

const Entry = () => {
  const navigate = useNavigate();
  const [inputPin, setInputPin] = useState("");

  const {
    data: realTime,
    // isError: isRTError,
    // isLoading: isRTLoading,
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
    toast.warn("無此房間");
  }

  return (
    <WrapHome>
      <HomeBg />
      <Logo onClick={() => navigate("/")} src="logo.png" alt="" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePart();
        }}
      >
        <EntryGame>
          <InputPin
            placeholder="遊戲pin碼"
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value.slice(0, 6))}
            type="number"
          />
          <WrapButton size="large">
            <p>進入</p>
          </WrapButton>
        </EntryGame>
      </form>
    </WrapHome>
  );
};

export default Entry;
