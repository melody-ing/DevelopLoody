import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useGameStore } from "../../utils/hook/useGameStore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import theme from "@/components/css/theme";
import Buttons from "@/components/Buttons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import Delete from "./Delete";
import Image from "./Image";
import Plus from "./Plus";
import {
  addFireStore,
  deleteFireStore,
  updateFireStore,
} from "@/utils/reviseFireStore";
import { serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useGetFireStores } from "@/utils/hook/useGetFireStore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const WrapDashBoard = styled.div`
  width: 70%;
  margin: 0 auto;
  text-align: left;
  margin-top: 2rem;
`;

const WrapQuestionBanks = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
`;

const WrapQuestionBank = styled.div`
  width: auto;
  height: 30rem;
  box-shadow: ${theme.shadow};
  border-radius: 5px;
`;
const WrapQBankImg = styled.div`
  height: 16rem;
  display: flex;
  justify-content: center;
`;

const QBankImg = styled.img`
  object-fit: contain;
  margin-top: 1rem;
`;

const WrapQBankInfo = styled.div`
  margin: 1rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  gap: 1rem;
`;

const QBankName = styled.input`
  font-size: 2rem;
  border-radius: 5px;
  border: none;
  /* padding: 0 10px; */
`;

const QBankTime = styled.p`
  font-size: 1.4rem;
  color: #adadad;
`;

const WrapQBankButtons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WrapContextMenuContent = styled(ContextMenuContent)`
  width: 10;
`;

const WrapContextMenuItem = styled(ContextMenuItem)`
  padding: 0.5rem 1rem;
  width: 100%;
  display: flex;
  gap: 2rem;
  align-items: center;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 3rem;
  cursor: pointer;
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 2rem;
`;

const FileInput = styled.input`
  display: none;
`;

const AddQBankButton = styled.div`
  position: fixed;
  right: 4rem;
  bottom: 4rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0px 3px 8px 0px #3333337a;
`;

const HoverCardContent = styled.div`
  color: ${theme.colors.secondary};
  box-shadow: ${theme.shadow};
  position: fixed;
  right: 1rem;
  width: 12rem;
  bottom: 10rem;
  height: 4rem;
  margin-bottom: 1rem;
  line-height: 4rem;
  text-align: center;
  border-radius: 5px;
`;

const DashBoard = () => {
  const navigate = useNavigate();

  const { userId, documentId } = useGameStore();
  const [isHover, setIsHover] = useState(false);
  const [data, setData] = useState([]);
  const [mediaUrl, setMediaUrl] = useState(null);

  const getFireStores = useGetFireStores("qbank");

  useEffect(() => {
    setData(getFireStores);
  }, [getFireStores]);

  async function handleAddFireStore() {
    navigate(`/create/${userId}/${documentId}`);
  }

  async function handleAddQBank() {
    addFireStore("qbank", {
      editTime: serverTimestamp(),
      name: `${moment().format("YYYY/MM/D h:mm:ss")}`,
      owner: "icecube0816",
      mainImg: "",
      questions: [
        {
          answer: 0,
          id: uuidv4(),
          media: "",
          options: ["", "", "", ""],
          timeLimit: 10,
          title: "",
          type: "mc",
        },
      ],
    });
  }

  function handleDelete(id) {
    deleteFireStore("qbank", id);
  }
  function handleRename(e, id) {
    updateFireStore("qbank", id, { name: e.target.value });
  }
  function handleAddImg(e, id) {
    e.preventDefault();
    if (e) {
      const file = e.target.files[0];
      const fileType = file.type;

      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

      if (validImageTypes.includes(fileType)) {
        const storage = getStorage();
        const imagesRef = ref(storage, `${Date.now()}`);
        uploadBytes(imagesRef, file)
          .then((snapshot) => {
            getDownloadURL(snapshot.ref)
              .then((url) => {
                setMediaUrl(url);

                updateFireStore("qbank", id, { mainImg: url });
              })
              .catch((error) => {
                console.log(error.message);
              });
          })
          .catch((error) => {
            console.log(error.message);
          });

        return;
      }
      alert("無效的檔案");
    }
  }
  function handleEdit(id) {
    navigate(`/create/${userId}/${id}`);
  }
  function handleHost(id) {}

  return (
    <>
      <Header />
      <WrapDashBoard>
        <h2>題庫</h2>
        <WrapQuestionBanks>
          {data &&
            data?.map((item) => (
              <>
                <FileInput
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={(e) => handleAddImg(e, item.id)}
                />
                <ContextMenu key={item.id}>
                  <ContextMenuTrigger>
                    <WrapQuestionBank>
                      <WrapQBankImg>
                        <QBankImg src={item.mainImg} />
                      </WrapQBankImg>
                      <WrapQBankInfo>
                        <QBankName
                          value={item.name}
                          onChange={(e) => handleRename(e, item.id)}
                        />

                        <QBankTime>
                          上次編輯：
                          {moment
                            .unix(item?.editTime?.seconds)
                            .add(item?.editTime?.nanoseconds / 1e9, "seconds")
                            .format("YYYY-MM-DD HH:mm")}
                        </QBankTime>
                        <WrapQBankButtons>
                          <div onClick={() => handleEdit(item.id)}>
                            <Buttons type="light" size="small">
                              編輯
                            </Buttons>
                          </div>
                          <div onClick={() => handleHost(item.id)}>
                            <Buttons type="success" size="small">
                              主持
                            </Buttons>
                          </div>
                        </WrapQBankButtons>
                      </WrapQBankInfo>
                    </WrapQuestionBank>
                  </ContextMenuTrigger>
                  <WrapContextMenuContent>
                    <WrapContextMenuItem>
                      <Delete size={12} />
                      <p>刪除</p>
                    </WrapContextMenuItem>
                    <WrapContextMenuItem>
                      <FileLabel htmlFor="fileInput">
                        <Image size={12} /> <p>新增首圖</p>
                      </FileLabel>
                    </WrapContextMenuItem>
                  </WrapContextMenuContent>
                </ContextMenu>
              </>
            ))}
        </WrapQuestionBanks>
      </WrapDashBoard>

      <AddQBankButton onClick={handleAddQBank}>
        <div
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Plus size={6} />
        </div>
      </AddQBankButton>
      {isHover && <HoverCardContent>建立新題庫</HoverCardContent>}
    </>
  );
};

export default DashBoard;
