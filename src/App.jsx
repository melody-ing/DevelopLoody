import { Outlet, useNavigate } from "react-router-dom";
import BaseGlobalStyle from "./components/css/BaseGlobalStyle";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "./components/Dialog/Dialog";
import { useStore } from "./utils/hook/useStore";
import Buttons from "./components/Buttons";
import styled from "styled-components";
import theme from "./components/css/theme";

const DialogTitle = styled.div`
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  line-height: 6rem;
  margin-bottom: 2rem;

  ${theme.breakpoints.xxs} {
    line-height: 3rem;
  }
`;

const WrapButtons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  margin: 0 auto;
  justify-content: space-around;
`;

const App = () => {
  const { isAiGenerate, setIsAiGenerate, aiQbankId } = useStore();
  const navigate = useNavigate();

  return (
    <div>
      {/* <Dialog isOpen={true}> */}
      <Dialog isOpen={isAiGenerate}>
        <DialogTitle> 是否進入AI生成題庫之編輯頁面</DialogTitle>
        <WrapButtons>
          {" "}
          <Buttons
            onClick={() => {
              navigate(`/create/${aiQbankId}`);
              setIsAiGenerate();
            }}
            size="small"
          >
            進入
          </Buttons>
          <Buttons onClick={setIsAiGenerate} size="small" type="light">
            取消
          </Buttons>
        </WrapButtons>
      </Dialog>
      <BaseGlobalStyle />
      <Outlet />
      <ToastContainer autoClose={2000} icon={false} transition={Slide} />
    </div>
  );
};

export default App;
