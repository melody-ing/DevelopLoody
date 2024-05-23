import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import theme from "@/components/css/theme";

import Plus from "./svg/Plus";
import { setFireStore } from "@/utils/reviseFireStore";
import { doc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
  useGetFireStore,
  useGetFireStores,
} from "@/utils/hook/useGetFireStore";
import { auth, db } from "@/utils/firebase";
import { useOnAuthStateChange } from "@/utils/hook/useOnAuthStateChange";
import Profile from "@/components/Profile";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import Duplicate from "./svg/Duplicate";
import Dialog from "@/components/Dialog/Dialog";
import { useNavigate } from "react-router-dom";
import Qbank from "./Qbank";

const Wrapper = styled.div`
  height: auto;
  min-height: 100vh;
  width: calc(100% - 22rem);
  background-color: #f5f5f3;
  overflow: ${({ $isShareOpen }) => $isShareOpen && "hidden"};
  height: ${({ $isShareOpen }) => $isShareOpen && "100vh"};
  margin-left: 22rem;
`;

const WrapProfile = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
`;

const WrapDashboard = styled.div`
  width: 86%;
  margin: 0 auto;
  text-align: left;
  padding-bottom: 4rem;

  ${theme.breakpoints.md} {
    width: 55%;
    h2 {
      font-size: 3rem;
    }
  }

  ${theme.breakpoints.sm} {
    margin: 0 auto;
    width: 90%;
  }
`;

const WrapQbanks = styled.div``;

const DashboardTitle = styled.h3`
  display: inline-block;
  margin-top: 6rem;
`;

const QbankNum = styled.p`
  display: inline-block;
  margin-left: 3rem;
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const NoQbankWarning = styled.div`
  position: fixed;
  top: 20rem;
  left: calc(50vw);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 1s forwards;
`;

const NoQbankWords = styled.div`
  font-size: 2rem;
  color: ${theme.colors.tertiary};

  width: 18rem;
`;

const NoQbankImg = styled.img`
  width: 16rem;
`;

const WrapQuestionBanks = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(15vw, 1fr));
  justify-content: center;
  gap: 2rem;

  ${theme.breakpoints.md} {
    grid-template-columns: repeat(3, minmax(17vw, 1fr));
  }
  ${theme.breakpoints.sm} {
    grid-template-columns: repeat(2, minmax(15vw, 1fr));
  }
`;

const ShareTitle = styled.h3``;

const WrapUrl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const ShareUrl = styled.div`
  margin: 2rem 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 1rem;
  width: 40rem;
`;

const AddQBankButton = styled.div`
  position: fixed;
  right: 4rem;
  bottom: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0px 3px 8px 0px #3333337a;
  background: linear-gradient(to top, #f7e8f1, #fff);

  div {
    cursor: pointer;
  }

  ${theme.breakpoints.sm} {
    right: 2rem;
    bottom: 2rem;
    width: 4.5rem;
    height: 4.5rem;
    padding: 0.5rem;
  }
`;

const Arrow = styled.img`
  position: absolute;
  left: -13rem;
  top: -7rem;
  max-width: 180%;
  width: 40rem;
  animation: ${fadeIn} 1s forwards;
`;

const HoverCardContent = styled.div`
  color: ${theme.colors.secondary};
  background-color: #fff;
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

const Dashboard = () => {
  const user = auth.currentUser;
  let uid = null;
  let ownerName = null;
  if (user) {
    uid = user.uid;
    ownerName = user.displayName;
  }
  const navigate = useNavigate();
  const {
    data: getUserData,
    // isLoading: userIsLoading,
    // isError: userIsError,
  } = useGetFireStore("users", uid);

  const [isHover, setIsHover] = useState(false);
  const [data, setData] = useState([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareQBankId, setShareQBankId] = useState(null);
  useOnAuthStateChange();

  const {
    data: qbanks,
    // isError,
    isLoading,
  } = useGetFireStores(`users/${uid}/qbanks`);

  useEffect(() => {
    const fetchData = () => {
      qbanks?.forEach((qbank) => {
        const docRef = doc(db, "qbank", qbank.id);
        const unsubscribe = onSnapshot(docRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setData((prevData) => {
              const newData = [...prevData];
              const index = newData.findIndex((item) => item.id === qbank.id);
              if (index !== -1) {
                newData[index] = { id: qbank.id, ...docSnapshot.data() };
              } else {
                newData.push({ id: qbank.id, ...docSnapshot.data() });
              }
              return newData;
            });
          } else {
            // console.log("Document does not exist");
          }
        });

        return unsubscribe;
      });
    };
    fetchData();
  }, [qbanks]);

  async function handleAddQBank() {
    const uuid = uuidv4();
    setFireStore(`users/${uid}/qbanks`, uuid, { id: uuid });
    setFireStore("qbank", uuid, {
      editTime: serverTimestamp(),
      name: `${moment().format("YYYY/MM/D h:mm")}`,
      owner: uid,
      ownerName,
      id: uuid,
      mainImg:
        "https://firebasestorage.googleapis.com/v0/b/loody-ing.appspot.com/o/1715678773074?alt=media&token=28fa8d44-6825-4885-a303-9b0b9c3abc1a",
      questions: [
        {
          answer: 0,
          id: uuid,
          media: "",
          options: ["", "", "", ""],
          timeLimit: 10,
          title: "",
          type: "mc",
        },
      ],
    });
    navigate(`/create/${uuid}`);
  }

  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(
        `${location.origin}/create/${shareQBankId}`
      );
      toast.warn("複製成功");
    } catch (error) {
      toast.error("複製失敗");
    }
  };

  return (
    <Wrapper>
      {" "}
      {isLoading ? (
        <>
          <WrapProfile>
            <Profile />
          </WrapProfile>
          <WrapDashboard>
            <WrapQbanks>
              <DashboardTitle>所有題庫</DashboardTitle>
              <QbankNum>題庫數量：{data && data.length}</QbankNum>

              <WrapQuestionBanks>
                {["", "", "", ""].map((item, index) => (
                  <div key={index}>
                    <Skeleton className="w-auto h-[30rem] rounded bg-gray-200" />
                  </div>
                ))}
              </WrapQuestionBanks>
            </WrapQbanks>
          </WrapDashboard>
          <AddQBankButton>
            <Plus size={6} />
          </AddQBankButton>
        </>
      ) : (
        <>
          <WrapProfile>
            <Profile />
          </WrapProfile>
          <WrapDashboard>
            <WrapQbanks>
              <DashboardTitle>所有題庫</DashboardTitle>
              <QbankNum className="melody">
                題庫數量：{data && data.length}
              </QbankNum>
              {qbanks !== null && data.length === 0 && (
                <NoQbankWarning>
                  <NoQbankImg src="/tree3.png" />
                  <NoQbankWords>建立你的第一個題庫</NoQbankWords>
                </NoQbankWarning>
              )}
              <WrapQuestionBanks>
                {data &&
                  data?.map((item, index) => (
                    <Qbank
                      key={index}
                      setShareQBankId={setShareQBankId}
                      uid={uid}
                      setData={setData}
                      setIsShareOpen={setIsShareOpen}
                      item={item}
                      getUserData={getUserData}
                    />
                  ))}
              </WrapQuestionBanks>
            </WrapQbanks>
          </WrapDashboard>

          <Dialog
            onClickCloseDialog={() => {
              setIsShareOpen(false);
            }}
            isOpen={isShareOpen}
          >
            {" "}
            <ShareTitle>複製連結以共用</ShareTitle>
            <WrapUrl>
              <ShareUrl>{`${location.origin}/create/${shareQBankId}`}</ShareUrl>
              <Duplicate size={4.6} onClick={handleCopyURL} />
            </WrapUrl>
          </Dialog>

          <AddQBankButton id="addQbank">
            {data.length === 0 && <Arrow src="/arrow.png" />}
            <div
              onClick={handleAddQBank}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
            >
              <Plus size={6} />
            </div>
          </AddQBankButton>
          {isHover && <HoverCardContent>建立新題庫</HoverCardContent>}
        </>
      )}
    </Wrapper>
  );
};

export default Dashboard;
