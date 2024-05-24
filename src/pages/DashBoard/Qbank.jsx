import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import theme from "@/components/css/theme";
import {
  Avatar as ComAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Delete from "./svg/Delete";
import Image from "./svg/Image";
import { deleteFireStore, updateFireStore } from "@/utils/reviseFireStore";
import moment from "moment";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Share from "./svg/Share";
import HostButton from "./HostButton";
import EllipsisBtn from "./EllipsisBtn";
import { useGetRealTime } from "@/utils/hook/useGetRealTime";

const WrapQuestionBank = styled.div`
  width: 100%;
  height: 30rem;
  box-shadow: ${theme.shadow};
  border-radius: 5px;
  background-color: #fff;
  position: relative;
`;
const WrapQBankImg = styled.div`
  height: 16rem;
  display: flex;
  justify-content: center;
  position: relative;
`;

const QuestionsQuantity = styled.p`
  position: absolute;
  font-size: 1.4rem;
  right: 0.5rem;
  bottom: 1rem;
  background-color: #cccccc85;
  border-radius: 5px;
  padding: 0rem 0.5rem;
`;

const QBankImg = styled.img`
  object-fit: cover;
  border-radius: 5px 5px 0 0;
`;

const WrapQBankAvatars = styled.div`
  position: absolute;
  display: flex;
  gap: -10rem;
  margin-top: 1rem;
  right: 0.3rem;
  top: -0.6rem;
  border-radius: 50%;
  border: 1px solid #ccc;
`;

const QBankAvatar = styled(ComAvatar)`
  width: 4rem;
  height: 4rem;
`;

const QBankAvatarFallback = styled(AvatarFallback)`
  font-size: 1.4rem;
`;

const WrapQBankInfo = styled.div`
  margin: 0rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  gap: 0.8rem;
  position: relative;

  ${theme.breakpoints.sm} {
    margin: 1rem 2rem;
  }
`;

const QBankName = styled.div`
  font-size: 1.6rem;
  line-height: 2.2rem;
  border: none;
  height: 4.4rem;

  ${theme.breakpoints.md} {
    font-size: 1.8rem;
  }
  ${theme.breakpoints.sm} {
    font-size: 1.6rem;
    height: 2rem;
  }
`;

const QBankTime = styled.p`
  font-size: 1.4rem;
  color: #adadad;

  ${theme.breakpoints.sm} {
    font-size: 1.2rem;
  }
`;

const WrapContextMenuContent = styled(ContextMenuContent)`
  z-index: 500;
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
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const NotValidCover = styled.div`
  position: absolute;
  z-index: 200;
  background-color: #4e4c4cc5;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 3rem;

  p {
    color: #fff;
  }
`;

const Qbank = ({
  setShareQBankId,
  uid,
  setData,
  item,
  getUserData,
  setIsShareOpen,
}) => {
  const [isQbankUsed, setIsQbankUsed] = useState(false);
  const chooseQBankId = useRef("");

  const {
    data: realTimeData,
    // isLoading: userIsLoading,
    // isError: userIsError,
  } = useGetRealTime(item.id);

  useEffect(() => {
    setIsQbankUsed(realTimeData !== null);
  }, [realTimeData]);

  function handleDelete(id, isMine) {
    if (isMine) {
      const confirmDelete = window.confirm(
        "確定要刪除嗎?(會連同分享給他人的資料一起刪掉)"
      );
      if (confirmDelete) {
        deleteFireStore(`users/${uid}/qbanks`, id);
        deleteFireStore("qbank", id);
        setData((prevData) => prevData.filter((qbank) => qbank.id !== id));
      }
    } else {
      const confirmDelete = window.confirm("確定要刪除嗎?");
      if (confirmDelete) {
        deleteFireStore(`users/${uid}/qbanks`, id);
        setData((prevData) => prevData.filter((qbank) => qbank.id !== id));
      }
    }
  }

  function handleAddImg(e) {
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
                updateFireStore("qbank", chooseQBankId.current, {
                  mainImg: url,
                });
              })
              .catch((error) => {
                // console.log(error.message);
              });
          })
          .catch((error) => {
            // console.log(error.message);
          });

        return;
      }
      alert("無效的檔案");
    }
  }

  return (
    <div key={item.id}>
      <FileInput
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={(e) => handleAddImg(e, item.id)}
      />
      <ContextMenu key={item.id}>
        <WrapQuestionBank id="testQbankNum">
          {isQbankUsed && (
            <NotValidCover>
              <p>
                其他裝置正在
                <br />
                使用這個題庫
              </p>
            </NotValidCover>
          )}
          <ContextMenuTrigger>
            <WrapQBankImg>
              <QBankImg src={item.mainImg ? item.mainImg : "/bankImg.jpg"} />
              {item.ownerName !== getUserData.name && (
                <WrapQBankAvatars>
                  <QBankAvatar>
                    <AvatarImage src="" />
                    <QBankAvatarFallback>
                      {item.ownerName.slice(0, 2)}
                    </QBankAvatarFallback>
                  </QBankAvatar>
                </WrapQBankAvatars>
              )}
              <QuestionsQuantity>{item.questions.length}題</QuestionsQuantity>
            </WrapQBankImg>
            <WrapQBankInfo>
              <EllipsisBtn
                setIsShareOpen={setIsShareOpen}
                setShareQBankId={setShareQBankId}
                handleDelete={handleDelete}
                chooseQBankId={chooseQBankId}
                item={item}
              />
              <QBankName className="overflow-clip">{item.name}</QBankName>

              <QBankTime>
                上次編輯：
                {moment
                  .unix(item?.editTime?.seconds)
                  .add(item?.editTime?.nanoseconds / 1e9, "seconds")
                  .format("YYYY-MM-DD")}
              </QBankTime>

              <HostButton item={item} />
            </WrapQBankInfo>
          </ContextMenuTrigger>
        </WrapQuestionBank>

        <WrapContextMenuContent>
          <WrapContextMenuItem
            onClick={() => {
              setIsShareOpen(true);
              setShareQBankId(item.id);
            }}
          >
            <Share size={12} />
            <p>分享</p>
          </WrapContextMenuItem>

          <WrapContextMenuItem
            onClick={() => {
              const isMine = item.ownerName === getUserData.name;
              handleDelete(item.id, isMine);
            }}
          >
            <Delete size={12} />
            <p>刪除</p>
          </WrapContextMenuItem>

          <WrapContextMenuItem
            onClick={() => (chooseQBankId.current = item.id)}
          >
            <FileLabel htmlFor="fileInput">
              <Image size={12} /> <p>新增封面</p>
            </FileLabel>
          </WrapContextMenuItem>
        </WrapContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default Qbank;
