import { useEffect, useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const WrapLoading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Title = styled.h2`
  font-size: 4rem;
  height: 8rem;
  margin-bottom: 5rem;
`;

const Treeone = styled.img`
  position: absolute;
  width: 12rem;
  bottom: 5rem;
`;
const Treetwo = styled.img`
  position: absolute;
  width: 8rem;
  bottom: 5rem;
`;

const LoadingHr = styled.hr`
  width: 50rem;
  height: 1rem;
  background-color: #3b7577;
  border-radius: 30px;
  border: none;
`;

const Wait = styled.div`
  margin-top: 2rem;
`;

const AiGenerateLoading = ({ isAiLoading }) => {
  const tree1Ref = useRef(null);
  const tree2Ref = useRef(null);

  useEffect(() => {
    if (!tree1Ref.current || !tree2Ref.current) return;
    gsap.registerPlugin(useGSAP);
    const treeTl = gsap.timeline({
      repeat: -1,
    });

    treeTl
      .from(tree1Ref.current, {
        opacity: 0,
        duration: 1,
        x: 300,
        ease: "linear",
      })
      .to(tree1Ref.current, {
        opacity: 0,
        duration: 1,
        x: -300,
        ease: "linear",
      })
      .from(tree2Ref.current, {
        opacity: 0,
        duration: 1,
        delay: 1,
        x: 300,
        ease: "linear",
      })
      .to(tree2Ref.current, {
        opacity: 0,
        duration: 1,
        x: -300,
        ease: "linear",
      });
  }, [isAiLoading]);

  return (
    <WrapLoading>
      {" "}
      <Title>題庫生成中...</Title>
      <Treeone ref={tree1Ref} src="/tree1.png" />
      <Treetwo ref={tree2Ref} src="/tree2.png" />
      <l-treadmill size="200" speed="1.25" color="#f7e173"></l-treadmill>
      <LoadingHr />
      <Wait>約需一分鐘...</Wait>
    </WrapLoading>
  );
};

export default AiGenerateLoading;
