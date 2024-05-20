import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Profile from "@/components/Profile";
import "ldrs/ring";
import { treadmill } from "ldrs";
import { useGetFireStore } from "@/utils/hook/useGetFireStore";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import theme from "@/components/css/theme";
import AiBg from "@/components/css/AiBg";
import Send from "./svg/Send";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useStore } from "@/utils/hook/useStore";
import { setFireStore } from "@/utils/reviseFireStore";
import AiGenerateLoading from "./AiGenerateLoading";

const Wrapper = styled.div`
  height: auto;
  min-height: 100vh;
  width: calc(100% - 22rem);
  overflow: ${({ $isShareOpen }) => $isShareOpen && "hidden"};
  height: ${({ $isShareOpen }) => $isShareOpen && "100vh"};
  margin-left: 22rem;
  z-index: 100;
`;

const WrapProfile = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
`;

const WrapAiGenerate = styled.div`
  padding-top: 8rem;
  gap: 2rem;
  align-items: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 4rem;
  height: 8rem;
  margin-bottom: 5rem;
`;

const Rules = styled.div`
  padding: 0 0.8rem 0rem 2rem;
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #ccc;
  border-radius: 20px;
  background-color: #fff;
  height: 6.5rem;
`;

const InputTheme = styled.input`
  height: 6rem;
  width: 80%;
  padding: 3rem;
  font-size: 2rem;
  outline: none;
  border: none;
  background: none;

  &::placeholder {
    font-size: 2rem;
  }
`;

const WrapSelected = styled.div`
  width: 10rem;
  height: auto;

  ${theme.breakpoints.sm} {
    position: absolute;

    bottom: 8rem;
    left: 1rem;
    display: flex;
    gap: 1rem;
  }
`;

const WrapSelect = styled(Select)`
  width: 100%;
  height: 100%;
  font-size: 3rem;

  &:focus {
    outline: none;
  }
`;

const WrapSelectTrigger = styled(SelectTrigger)`
  height: 4rem;
  background-color: #ffffff;
  outline: none;
  border: none;
  font-size: 1.6rem;
  line-height: 2rem;
  text-align: center;
  border-radius: 10px;

  ${theme.breakpoints.sm} {
    font-size: 1.4rem;
  }

  &:focus {
    outline: none;
  }

  span {
    font-size: 2rem;
    letter-spacing: 0.5rem;
  }
`;

const WrapSelectContent = styled(SelectContent)`
  width: 100%;
  height: auto;
  cursor: pointer;
  background-color: #fffefe;
  outline: none;
  border: none;

  ${theme.breakpoints.sm} {
    font-size: 1.4rem;
    width: auto;
  }

  &:focus {
    outline: none;
  }
`;

const WrapSelectItem = styled(SelectItem)`
  width: 100%;
  height: 4rem;
  padding: 1rem auto;
  cursor: pointer;
  font-size: 1.8rem;
  letter-spacing: 0.5rem;

  ${theme.breakpoints.sm} {
    font-size: 1.4rem;
  }
`;

const Button = styled.div`
  background-color: ${theme.colors.secondary};
  color: #fff;
  padding: 1rem 1.5rem;
  display: flex;
  letter-spacing: 0.4rem;
  border-radius: 15px;
  width: 9rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.tertiary};
    transition: background-color 0.3s ease;
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0px 2px 2px #3533387f;
  }
`;

const AiGenerate = () => {
  const { isAiLoading, setIsAiLoading, setIsAiGenerate, setAiQbankId } =
    useStore();
  const [quantity, setQuantity] = useState("1");
  const [uid, setUid] = useState(null);
  const [theme, setTheme] = useState("");
  const [isError, setIsError] = useState(null);
  const userUid = useOnAuthStateChange();
  const titleRef = useRef(null);
  const {
    data: getUserData,
    isLoading: userDataIsLoading,
    isError: userDataIsError,
  } = useGetFireStore("users", uid);
  const uuid = uuidv4();

  useEffect(() => {
    setUid(userUid);
  }, [userUid]);

  const handleOpenai = async () => {
    setIsAiLoading(true);
    try {
      const qbankId = uuid;
      const response = await fetch(
        `https://loodyserver.onrender.com/openai/${qbankId}?theme=${theme}&owner=${uid}&ownerName=${getUserData.name}&quantity=${quantity}`
      );
      // const response = await fetch(
      //   `http://localhost:3000/openai/${qbankId}?theme=${theme}&owner=${uid}&ownerName=${getUserData.name}&quantity=${quantity}`
      // );

      if (!response.ok) {
        setIsError(true);
        throw new Error("Network response was not ok");
      }

      setIsAiLoading(false);
      setIsAiGenerate();
      setIsError(null);
      setAiQbankId(qbankId);

      setFireStore(`users/${uid}/qbanks`, qbankId, {
        id: qbankId,
      });
    } catch (error) {
      setIsAiLoading(false);
      setIsError(error.message);
      // console.error("There was a problem with your fetch operation:", error);
    }
  };

  treadmill.register();

  useEffect(() => {
    gsap.registerPlugin(TextPlugin);

    const tl = gsap.timeline();
    tl.to(titleRef.current, {
      duration: 1,
      text: "需要新的想法嗎?",
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <AiBg />
      <Wrapper>
        <WrapProfile>
          <Profile />
        </WrapProfile>

        <WrapAiGenerate>
          {isAiLoading ? (
            <AiGenerateLoading isAiLoading={isAiLoading} />
          ) : (
            <>
              <Title ref={titleRef}></Title>
              <Rules>
                <WrapSelected>
                  <WrapSelect
                    value={quantity}
                    onValueChange={(e) => setQuantity(e)}
                  >
                    <WrapSelectTrigger className="justify-around">
                      <SelectValue placeholder="請選擇" />
                    </WrapSelectTrigger>
                    <WrapSelectContent>
                      {Array(5)
                        .fill("")
                        .map((_, index) => (
                          <WrapSelectItem key={index} value={`${index + 1}`}>
                            {`${index + 1}`}題
                          </WrapSelectItem>
                        ))}
                    </WrapSelectContent>
                  </WrapSelect>
                </WrapSelected>
                <hr />
                <InputTheme
                  placeholder="ex.動物知識"
                  type="text"
                  onChange={(e) => setTheme(e.target.value)}
                  value={theme}
                />{" "}
                <Button onClick={() => handleOpenai()}>
                  <p>生成</p>
                  <Send size={2} />
                </Button>
              </Rules>
            </>
          )}
        </WrapAiGenerate>
      </Wrapper>
    </>
  );
};

export default AiGenerate;
