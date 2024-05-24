import styled from "styled-components";
import theme from "@/components/css/theme";
import { setFireStore } from "@/utils/reviseFireStore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import TextField from "@mui/material/TextField";
import Mryellow from "@/components/css/animation/Mryellow";
import Mrpurple from "@/components/css/animation/Mrpurple";
import Delete from "../svg/Delete";

const WrapEditAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
  padding-top: 2rem;
  height: 100vh;
  overflow: hidden;

  ${theme.breakpoints.sm} {
    height: 250%;
  }
`;

const WrapMryellow = styled.div`
  position: absolute;
  bottom: -60%;
  right: -50%;
  z-index: -1;
`;

const WrapMrpurple = styled.div`
  position: absolute;
  top: -60%;
  left: -50%;
  z-index: -1;
`;

const QuestionInput = styled(TextField)`
  width: 96%;

  & .MuiOutlinedInput-root {
    box-shadow: 0px 0px 4px 0px #33333369;
    font-size: 2.2rem;
    width: 100%;
    background-color: #fff;
  }

  & .MuiOutlinedInput-input {
    text-align: center;
  }

  & .MuiFormLabel-root {
    font-size: 2rem;
  }

  ${theme.breakpoints.sm} {
    & .MuiOutlinedInput-root {
      box-shadow: 0px 0px 4px 0px #33333369;
      font-size: 1.8rem;
      width: 100%;
      margin-top: 0rem;
      padding: 0;
    }

    & .MuiOutlinedInput-input {
      text-align: center;
      padding: 1rem;
      height: 3rem;
    }

    & .MuiFormLabel-root {
      font-size: 1.4rem;
      margin-top: 0rem;
    }
  }
`;

const WrapAnswer = styled.div`
  width: 94%;
  justify-content: center;
  display: grid;
  grid-template-columns: repeat(2, 50%);
  gap: 2rem;
  margin-top: 4rem;
  position: absolute;
  bottom: 2rem;

  ${theme.breakpoints.sm} {
    width: 90%;
    gap: 1rem;
  }
`;

const WrapAnswerInput = styled.div`
  ${({ $isFill }) => $isFill || "border: 1px solid red"};
  width: 100%;
  height: 8rem;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 4px 0px #33333369;
  justify-content: space-around;
  padding: 1rem;
  padding-left: 2rem;
  border-radius: 5px;
  background-color: #fff;
  position: relative;

  input[type="radio"] {
    width: 4.4rem;
    color: ${theme.colors.secondary};
    accent-color: ${theme.colors.tertiary};
  }

  ${theme.breakpoints.sm} {
    height: 5.4rem;
    padding-left: 1rem;

    input[type="radio"] {
      width: 3rem;
    }
  }
`;

const TextAreaInput = styled(TextField)`
  & .MuiOutlinedInput-root {
    font-size: 2rem;
    width: 100%;
  }

  & .MuiOutlinedInput-input {
  }

  & .MuiFormLabel-root {
    font-size: 2rem;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }

  ${theme.breakpoints.sm} {
    & .MuiOutlinedInput-root {
      font-size: 1.6rem;
      width: 100%;
    }

    & .MuiOutlinedInput-input {
    }

    & .MuiFormLabel-root {
      font-size: 1.2rem;
      margin-top: 0.4rem;
    }

    & .MuiOutlinedInput-notchedOutline {
      border: none;
    }
  }
`;

const WrapShortAnswerInput = styled.div`
  ${({ $isFill }) => $isFill || "border: 1px solid red"};

  width: 80%;
  height: 8rem;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 4px 0px #33333369;
  justify-content: space-around;
  padding: 1rem;
  padding-left: 2rem;
  border-radius: 5px;
  position: absolute;
  bottom: 12rem;
  background-color: #fff;

  ${theme.breakpoints.sm} {
    height: 5.6rem;
    bottom: 2rem;
  }
`;

const ShortAnswerInput = styled(TextField)`
  width: 100%;
  outline: none;
  border: none;
  font-size: 2.6rem;
  text-align: center;

  & .MuiOutlinedInput-root {
    font-size: 2.4rem;
    width: 100%;
  }

  & .MuiOutlinedInput-input {
    text-align: center;
  }

  & .MuiFormLabel-root {
    font-size: 2rem;
    margin-top: 0.6rem;
  }

  & .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

const TextAreaWrapper = styled.div`
  width: 100%;
  max-width: 34rem;
  height: 5.4rem;
  font-size: 20px;
  color: ${theme.colors.info};
  display: flex;
  align-items: center;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: inline-block;
  padding: 1rem;
  max-width: 70rem;
  height: auto;
  border: 2px solid #ccc;
  color: #333;
  position: relative;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2.4rem;

  display: flex;
  justify-content: center;
  align-items: center;

  ${theme.breakpoints.sm} {
    font-size: 1.2rem;
    margin-top: 1.6rem;
  }
`;

const WrapMedia = styled.div`
  padding: 1rem;
  max-width: 70rem;
  height: auto;
  border: 2px solid #ccc;
  color: #333;
  position: relative;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2.4rem;
  display: flex;
  justify-content: center;
  align-items: center;

  ${theme.breakpoints.sm} {
    font-size: 1.2rem;
    margin-top: 1.6rem;
  }
`;

const ViewMedia = styled.img`
  max-height: calc(100vh - 40rem);
  max-width: calc(100vw - 50rem);
  object-fit: contain;
  ${theme.breakpoints.sm} {
    max-height: calc(100vh - 54rem);
    max-width: 70vw;
    object-fit: contain;
  }
`;

const InputMediaDelete = styled.div`
  position: absolute;
  right: 1.2rem;
  bottom: 1.2rem;
  border-radius: 5px;
  background-color: #ffffffb5;
`;

const WrapQuestionInput = styled.div`
  position: relative;
  width: 100%;

  ${theme.breakpoints.sm} {
    width: 96%;
  }
`;

const TitleTextWarning = styled.div`
  position: absolute;
  color: #c7c7c7;
  right: 2.4rem;
  top: 4rem;
  font-size: 1.4rem;

  ${theme.breakpoints.sm} {
    top: 2.8rem;
    right: 1.2rem;
  }
`;

const OptionTextWarning = styled.div`
  position: absolute;
  color: #c7c7c7;
  right: 0.6rem;
  top: 5.6rem;
  font-size: 1.4rem;

  ${theme.breakpoints.sm} {
    top: 3rem;
  }
`;

const EditAreaWrapper = ({
  setTitle,
  getQbankData,
  editNum,
  handleIsChange,
  question,
  setAnswerRadio,
  questionType,
  setInputOptions,
  setMediaUrl,
  isTitleFill,
  title,
  mediaUrl,
  isOptionsFill,
  inputOptions,
  answerRadio,
  getUrlDocumentId,
}) => {
  function handleTitleInput(e) {
    setTitle(e.target.value.slice(0, 40));
    getQbankData.questions[editNum].title = e.target.value.slice(0, 40);
    handleIsChange();
  }

  function handleAnswerRadio(e) {
    if (question.type === "mc" || question.type === "tf") {
      setAnswerRadio(+e.target.value);
      getQbankData.questions[editNum].answer = +e.target.value;
    }
    if (question.type === "sa") {
      setAnswerRadio(e.target.value.toUpperCase());
      getQbankData.questions[editNum].answer = e.target.value.toUpperCase();
    }
    handleIsChange();
  }

  function handleAnswerInput(e, index) {
    if (questionType === "mc" || questionType === "tf") {
      setInputOptions((inputOptions) => {
        const newArray = [...inputOptions];
        newArray[index] = e.target.value.slice(0, 15);
        return newArray;
      });
      getQbankData.questions[editNum].options[index] = e.target.value.slice(
        0,
        15
      );
    } else {
      setInputOptions((inputOptions) => {
        const newArray = [...inputOptions];
        newArray[index] = e.target.value.toUpperCase().slice(0, 15);
        return newArray;
      });
      getQbankData.questions[editNum].options[index] = e.target.value
        .toUpperCase()
        .slice(0, 15);
    }

    handleIsChange();
  }

  function handleFileInput(e) {
    if (e) {
      const file = e.target.files[0];
      const fileType = file.type;

      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      // const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      // const validAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg"];

      if (
        validImageTypes.includes(fileType)
        // validVideoTypes.includes(fileType) ||
        // validAudioTypes.includes(fileType)
      ) {
        const storage = getStorage();
        const imagesRef = ref(storage, `${Date.now()}`);
        uploadBytes(imagesRef, file)
          .then((snapshot) => {
            getDownloadURL(snapshot.ref)
              .then((url) => {
                setMediaUrl(url);
                getQbankData.questions[editNum].media = url;
                setFireStore("qbank", getUrlDocumentId, getQbankData);
              })
              .catch(() => {
                // console.log(error.message);
              });
          })
          .catch(() => {
            // console.log(error.message);
          });

        return;
      }
      alert("無效的檔案");
    }
  }

  function handleDeleteMedia() {
    setMediaUrl("");
    getQbankData.questions[editNum].media = "";
    setFireStore("qbank", getUrlDocumentId, getQbankData);
  }
  return (
    <WrapEditAreaWrapper>
      <WrapMryellow>
        <Mryellow />
      </WrapMryellow>
      <WrapMrpurple>
        <Mrpurple />
      </WrapMrpurple>
      <WrapQuestionInput>
        <QuestionInput
          error={!isTitleFill}
          id="outlined-error"
          label={isTitleFill ? null : "請輸入題目"}
          value={title}
          onChange={handleTitleInput}
        />
        <TitleTextWarning>{title ? title.length : 0}/40</TitleTextWarning>
      </WrapQuestionInput>
      {mediaUrl === "" ? (
        <FileLabel htmlFor={"fileInput"}>
          <p>輸入圖片</p>
        </FileLabel>
      ) : (
        <WrapMedia>
          <ViewMedia src={mediaUrl} />
          <InputMediaDelete onClick={handleDeleteMedia}>
            <Delete size={window.innerWidth < 940 ? 3 : 4.4} />
          </InputMediaDelete>
        </WrapMedia>
      )}

      <FileInput
        type="file"
        id="fileInput"
        accept="audio/*,image/*,.png"
        onChange={handleFileInput}
      />
      {(question?.type === "mc" || question?.type === "tf") && (
        <WrapAnswer>
          {question?.options.map((option, index) => (
            <WrapAnswerInput key={index} $isFill={isOptionsFill[index]}>
              <input
                type="radio"
                name="answer"
                id={`radio${index}`}
                value={index}
                onChange={handleAnswerRadio}
                checked={index === answerRadio}
              />
              <TextAreaWrapper>
                <TextAreaInput
                  error={!isOptionsFill[index]}
                  label={isOptionsFill[index] ? null : "請輸入選項"}
                  value={inputOptions[index]}
                  onChange={(e) => handleAnswerInput(e, index)}
                />
              </TextAreaWrapper>
              <OptionTextWarning>
                {inputOptions[index] ? inputOptions[index].length : "0"}
                /15
              </OptionTextWarning>
            </WrapAnswerInput>
          ))}
        </WrapAnswer>
      )}
      {question.type === "sa" &&
        question?.options.map((option, index) => (
          <WrapShortAnswerInput key={index} $isFill={isOptionsFill[index]}>
            <ShortAnswerInput
              error={!isOptionsFill[index]}
              label={isOptionsFill[index] ? null : "請輸入答案"}
              type="text"
              value={inputOptions[index]}
              onChange={(e) => {
                handleAnswerRadio(e);
                handleAnswerInput(e, index);
              }}
            />
            <OptionTextWarning>
              {inputOptions[index] ? inputOptions[index].length : "0"}
              /15
            </OptionTextWarning>
          </WrapShortAnswerInput>
        ))}
    </WrapEditAreaWrapper>
  );
};

export default EditAreaWrapper;
