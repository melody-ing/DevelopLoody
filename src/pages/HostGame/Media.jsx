import theme from "@/components/css/theme";
import styled from "styled-components";

const WrapMedia = styled.div`
  max-width: 50rem;
  margin: 0 auto;

  img {
    max-height: calc(100vh - 40rem);
    object-fit: contain;
  }

  ${theme.breakpoints.sm} {
    position: absolute;
    left: 50vw;
    transform: translate(-50%);

    img {
      max-height: 24rem;
      object-fit: contain;
    }
  }

  ${theme.breakpoints.xxs} {
    img {
      max-width: 15rem;
    }
  }
`;

const Media = ({ questions }) => {
  return (
    <WrapMedia>
      <img src={questions.media} alt="" />
    </WrapMedia>
  );
};

export default Media;
