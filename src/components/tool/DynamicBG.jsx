import styled from "styled-components";

const WrapVideo = styled.div`
  max-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
`;

const DynamicBG = () => {
  return (
    <WrapVideo>
      <video autoPlay muted>
        {" "}
        <source src="/4KBG.mp4" type="video/mp4" />
      </video>
    </WrapVideo>
  );
};

export default DynamicBG;
