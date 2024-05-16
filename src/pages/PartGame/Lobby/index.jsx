import styled from "styled-components";
import ReactLoading from "react-loading";
import NameTag from "@/components/css/animation/NameTag";

const WrapLobby = styled.div`
  width: 100%;
  margin: 0 auto;
  height: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  position: fixed;
  bottom: 40vh;

  h3 {
    color: #fff;
    line-height: 2rem;
  }
`;

const WrapNameTag = styled.div`
  position: absolute;
  top: -26rem;
  z-index: -1;
`;

const Lobby = ({ user }) => {
  return (
    <WrapLobby>
      <WrapNameTag>
        <NameTag />
      </WrapNameTag>

      <h3>Hola！</h3>
      <h3>{user.name}</h3>
      <ReactLoading type="balls" color="#ecc66d" height={100} width={100} />
    </WrapLobby>
  );
};

export default Lobby;
