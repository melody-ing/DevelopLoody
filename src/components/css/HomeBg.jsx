import styled, { keyframes } from "styled-components";

const animate = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
`;

const WrapHomeBg = styled.div`
  .background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    background: linear-gradient(#ebdb86, #dfd8ac);
    overflow: hidden;
    z-index: -1;
    cursor: default;
  }
  .background li {
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    animation: ${animate} 19s linear infinite;
  }

  .background li:nth-child(0) {
    left: 73%;
    width: 177px;
    height: 177px;
    bottom: -177px;
    animation-delay: 0s;
  }
  .background li:nth-child(1) {
    left: 62%;
    width: 111px;
    height: 111px;
    bottom: -111px;
    animation-delay: 1s;
  }
  .background li:nth-child(2) {
    left: 74%;
    width: 193px;
    height: 193px;
    bottom: -193px;
    animation-delay: 8s;
  }
  .background li:nth-child(3) {
    left: 70%;
    width: 151px;
    height: 151px;
    bottom: -151px;
    animation-delay: 15s;
  }
  .background li:nth-child(4) {
    left: 3%;
    width: 169px;
    height: 169px;
    bottom: -169px;
    animation-delay: 9s;
  }
  .background li:nth-child(5) {
    left: 86%;
    width: 158px;
    height: 158px;
    bottom: -158px;
    animation-delay: 7s;
  }
  .background li:nth-child(6) {
    left: 30%;
    width: 170px;
    height: 170px;
    bottom: -170px;
    animation-delay: 9s;
  }
  .background li:nth-child(7) {
    left: 76%;
    width: 182px;
    height: 182px;
    bottom: -182px;
    animation-delay: 14s;
  }
  .background li:nth-child(8) {
    left: 63%;
    width: 194px;
    height: 194px;
    bottom: -194px;
    animation-delay: 27s;
  }
  .background li:nth-child(9) {
    left: 32%;
    width: 162px;
    height: 162px;
    bottom: -162px;
    animation-delay: 14s;
  }
  .background li:nth-child(10) {
    left: 39%;
    width: 188px;
    height: 188px;
    bottom: -188px;
    animation-delay: 19s;
  }
  .background li:nth-child(11) {
    left: 64%;
    width: 169px;
    height: 169px;
    bottom: -169px;
    animation-delay: 8s;
  }
  .background li:nth-child(12) {
    left: 41%;
    width: 193px;
    height: 193px;
    bottom: -193px;
    animation-delay: 7s;
  }
  .background li:nth-child(13) {
    left: 44%;
    width: 149px;
    height: 149px;
    bottom: -149px;
    animation-delay: 7s;
  }
  .background li:nth-child(14) {
    left: 24%;
    width: 185px;
    height: 185px;
    bottom: -185px;
    animation-delay: 1s;
  }
  .background li:nth-child(15) {
    left: 19%;
    width: 102px;
    height: 102px;
    bottom: -102px;
    animation-delay: 67s;
  }
  .background li:nth-child(16) {
    left: 51%;
    width: 161px;
    height: 161px;
    bottom: -161px;
    animation-delay: 36s;
  }
  .background li:nth-child(17) {
    left: 4%;
    width: 114px;
    height: 114px;
    bottom: -114px;
    animation-delay: 34s;
  }
  .background li:nth-child(18) {
    left: 26%;
    width: 125px;
    height: 125px;
    bottom: -125px;
    animation-delay: 90s;
  }
  .background li:nth-child(19) {
    left: 59%;
    width: 193px;
    height: 193px;
    bottom: -193px;
    animation-delay: 41s;
  }
  .background li:nth-child(20) {
    left: 75%;
    width: 152px;
    height: 152px;
    bottom: -152px;
    animation-delay: 32s;
  }
  .background li:nth-child(21) {
    left: 86%;
    width: 131px;
    height: 131px;
    bottom: -131px;
    animation-delay: 29s;
  }
  .background li:nth-child(22) {
    left: 4%;
    width: 176px;
    height: 176px;
    bottom: -176px;
    animation-delay: 20s;
  }
  .background li:nth-child(23) {
    left: 8%;
    width: 169px;
    height: 169px;
    bottom: -169px;
    animation-delay: 107s;
  }
  .background li:nth-child(24) {
    left: 28%;
    width: 192px;
    height: 192px;
    bottom: -192px;
    animation-delay: 107s;
  }
  .background li:nth-child(25) {
    left: 80%;
    width: 185px;
    height: 185px;
    bottom: -185px;
    animation-delay: 93s;
  }
  .background li:nth-child(26) {
    left: 20%;
    width: 114px;
    height: 114px;
    bottom: -114px;
    animation-delay: 62s;
  }
`;

const HomeBg = () => {
  return (
    <WrapHomeBg>
      <ul className="background">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </WrapHomeBg>
  );
};

export default HomeBg;
