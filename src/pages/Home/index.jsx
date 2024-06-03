import HomeBg from "@/components/css/HomeBg";
import { auth } from "@/utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../../components/css/swiper.css";
import theme from "../../components/css/theme";
import SignDialog from "./SignDialog";

const WrapHome = styled.div`
  width: 100%;
  height: 100vh;
  overflow-y: hidden;

  ${theme.breakpoints.xs} {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const WrapLeft = styled.div`
  position: absolute;
  left: 16rem;
  top: 45vh;
  transform: translate(0, -50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1.5rem;

  @media screen and (max-width: 1070px) {
    left: 8rem;
  }

  ${theme.breakpoints.xs} {
    position: static;
    margin-top: 10rem;
    transform: translate(0);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70%;
  }
`;

const Logo = styled.img`
  width: auto;
  height: 7rem;

  ${theme.breakpoints.sm} {
    height: 6rem;
  }
`;

const Slogan = styled.div`
  text-align: start;
  font-size: 2rem;
  width: 30rem;
  line-height: 3rem;

  ${theme.breakpoints.xs} {
    width: auto;
    text-align: center;
  }
`;

const WrapButton = styled.div`
  background-color: ${theme.colors.secondary};
  font-size: 1.8rem;
  color: ${theme.colors.light};
  margin-top: 1.6rem;
  line-height: 5rem;
  width: 22rem;
  height: 5rem;
  border-radius: 10px;
  box-shadow: ${theme.shadow};
  border: none;
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.tertiary};
  }

  ${theme.breakpoints.xs} {
    position: absolute;
    left: 4rem;
    top: 20rem;
    margin-top: 0;
    width: 16rem;
  }

  ${theme.breakpoints.xxs} {
    position: static;
    margin-top: 6rem;
  }
`;

const WrapRight = styled.div`
  position: absolute;
  right: 16rem;
  top: 46vh;
  transform: translate(0, -50%);
  display: flex;
  justify-content: center;
  z-index: 1;

  @media screen and (max-width: 1070px) {
    right: 8rem;
  }

  ${theme.breakpoints.xs} {
    position: static;
    margin-top: 30rem;
  }

  ${theme.breakpoints.xxs} {
    margin-top: 18rem;
  }
`;

const WrapDrawShape = styled.div`
  position: absolute;
  top: 11rem;
  right: -12rem;
  transform: rotate(-12deg);
  z-index: 1;

  @media screen and (max-width: 1080px) {
    display: none;
  }
`;

const DrawShape = styled.img`
  width: 40rem;
  max-width: 90rem;
  z-index: 1;
`;

const WrapFlowerShape = styled.div`
  position: absolute;
  top: -12rem;
  left: -20rem;
  transform: rotate(-12deg);
  z-index: 1;
  ${theme.breakpoints.xs} {
    display: none;
  }
`;

const FlowerShape = styled.img`
  width: 60rem;
  max-width: 90rem;
  z-index: 1;
`;

const WrapSwiper = styled.div``;

const WrapWrapSwiper = styled(Swiper)`
  width: 40vw;
  height: 28vw;

  ${theme.breakpoints.xs} {
    width: 60vw;
    height: 42vw;
  }

  ${theme.breakpoints.xxs} {
    width: 80vw;
    height: 55vw;
    margin: auto;
  }
`;

const WrapSwiperSlide = styled(SwiperSlide)``;

const Login = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${theme.colors.secondary};
  width: 22rem;
  height: 1rem;
  line-height: 2.8rem;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  ${theme.breakpoints.xs} {
    position: absolute;
    top: 16rem;
  }
`;

const Home = () => {
  const navigate = useNavigate();

  const handleToEntry = () => {
    navigate("/entry");
  };

  function handleTestAccount() {
    signInWithEmailAndPassword(auth, "testtest@gmail.com", "testtest")
      .then(() => {
        navigate(`/dashboard`);
      })
      .catch(() => {
        alert("發生錯誤: " + error.message);
      });
  }

  return (
    <WrapHome>
      <HomeBg />

      <WrapLeft>
        <Logo src="logo.png" alt="" />
        <Slogan>
          創新學習新體驗
          <br />
          讓所有人一起加入學習派對！
        </Slogan>
        <WrapButton onClick={handleToEntry} data-testid="button">
          加入遊戲
        </WrapButton>
        <SignDialog />
        <Login onClick={handleTestAccount}>使用測試帳號加入</Login>
      </WrapLeft>
      <WrapRight>
        <WrapDrawShape>
          <DrawShape src="/draw.png" />
        </WrapDrawShape>
        <WrapFlowerShape>
          <FlowerShape src="/flower.png" />
        </WrapFlowerShape>
        <WrapSwiper>
          {" "}
          <WrapWrapSwiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper"
          >
            <WrapSwiperSlide></WrapSwiperSlide>
            <WrapSwiperSlide></WrapSwiperSlide>
          </WrapWrapSwiper>
        </WrapSwiper>
      </WrapRight>
    </WrapHome>
  );
};

export default Home;
