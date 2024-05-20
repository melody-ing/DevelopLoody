import styled from "styled-components";
import theme from "../../components/css/theme";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import "../../components/css/swiper.css";
import HomeBg from "@/components/css/HomeBg";
import SignDialog from "./SignDialog";

const WrapHome = styled.div``;

const WrapLeft = styled.div`
  position: absolute;
  left: 20rem;
  top: 45vh;
  transform: translate(0, -50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1.5rem;
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
`;

const WrapRight = styled.div`
  position: absolute;
  right: 20rem;
  top: 46vh;
  transform: translate(0, -50%);
  display: flex;
  justify-content: center;
`;

const WrapDrawShape = styled.div`
  position: absolute;
  top: 8rem;
  right: -12rem;
  transform: rotate(-12deg);
`;

const DrawShape = styled.img`
  width: 40rem;
  max-width: 90rem;
`;

const WrapFlowerShape = styled.div`
  position: absolute;
  top: -14rem;
  left: -20rem;
  transform: rotate(-12deg);
`;

const FlowerShape = styled.img`
  width: 60rem;
  max-width: 90rem;
`;

const WrapSwiper = styled.div`
  width: 50rem;
  height: 32rem;
  overflow: hidden;
`;

const Home = () => {
  const navigate = useNavigate();

  const handleToEntry = () => {
    navigate("/entry");
  };

  return (
    <WrapHome>
      <HomeBg />

      <WrapLeft>
        <Logo src="logo.png" alt="" />
        <Slogan>創新學習新體驗，讓所有人一起加入學習派對！</Slogan>
        {/* <Slogan>Leave Ordinary Outside, Dive into your Youthful side!</Slogan> */}
        <WrapButton onClick={handleToEntry} data-testid="button">
          加入遊戲
        </WrapButton>
        <SignDialog />
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
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper"
          >
            <SwiperSlide></SwiperSlide>
            <SwiperSlide></SwiperSlide>
          </Swiper>
        </WrapSwiper>
      </WrapRight>
    </WrapHome>
  );
};

export default Home;
