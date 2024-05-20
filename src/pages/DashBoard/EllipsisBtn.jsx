import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Ellipsis from "./Ellipsis";
import Share from "./Share";
import Delete from "./Delete";
import Image from "./Image";

const WrapEllipsis = styled.div`
  position: absolute;
  right: -1.6rem;
  top: 0.9rem;
  cursor: pointer;

  &:hover {
    background-color: #eaeaea;
    border-radius: 50%;
  }
`;

const WrapEllipsisMenuContent = styled.div`
  z-index: 500;
  position: absolute;
  right: 0.5rem;
  box-shadow: 0px 3px 2px 0px #3333337a;
  border-radius: 2px;
  background-color: #fff;
  border: 1px solid #dbdbdb;
`;

const WrapEllipsisMenuItem = styled.div`
  padding: 0.5rem 1rem;
  width: 100%;
  display: flex;
  gap: 2rem;
  align-items: center;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 3rem;
  cursor: pointer;

  &:hover {
    background-color: #eff2f7;
  }
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 2rem;
  cursor: pointer;
`;

const EllipsisBtn = ({
  setIsShareOpen,
  setShareQBankId,
  handleDelete,
  chooseQBankId,
  item,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  const openPopup = () => {
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {" "}
      <WrapEllipsis onClick={() => openPopup()}>
        <Ellipsis size="10" />
      </WrapEllipsis>
      {isOpen && (
        <WrapEllipsisMenuContent ref={popupRef}>
          <WrapEllipsisMenuItem
            onClick={() => {
              setIsShareOpen(true);
              setShareQBankId(item.id);
              closePopup();
            }}
          >
            <Share size={12} />
            <p>分享</p>
          </WrapEllipsisMenuItem>

          <WrapEllipsisMenuItem
            onClick={() => {
              handleDelete(item.id);
              closePopup();
            }}
          >
            <Delete size={12} />
            <p>刪除</p>
          </WrapEllipsisMenuItem>

          <WrapEllipsisMenuItem
            onClick={() => {
              chooseQBankId.current = item.id;
            }}
          >
            <FileLabel htmlFor="fileInput">
              <Image size={12} /> <p>新增封面</p>
            </FileLabel>
          </WrapEllipsisMenuItem>
        </WrapEllipsisMenuContent>
      )}
    </div>
  );
};

export default EllipsisBtn;
