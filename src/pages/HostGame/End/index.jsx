import styled from "styled-components";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Confetti from "react-confetti";
import theme from "@/components/css/theme";

const WrapConfetti = styled.div`
  position: fixed;
  left: 0;
  z-index: 0;
  top: 0;
`;

const WrapRank = styled.div`
  bottom: 0;
  width: 100vw;
  z-index: -2;
  height: 100vh;
`;

const WrapPodium = styled.div`
  width: 70%;
  position: absolute;
  bottom: 0rem;
  left: 15%;
  margin: 0 auto;
  z-index: -2;

  /* ${theme.breakpoints.sm} {
    position: absolute;
    bottom: 6rem;
    left: 50vw;
    transform: translate(-50%);

  } */
`;

const Podium = styled.img`
  z-index: -2;
  height: 34vw;
  overflow: hidden;
`;

const First = styled.div`
  position: absolute;
  top: -3vw;
  right: 50%;
  z-index: 100;
  transform: translate(50%);
  color: #403d39;
`;

const Second = styled.div`
  position: absolute;
  top: 10vw;
  left: 32%;
  z-index: 100;
  color: #403d39;
  transform: translate(-50%);
`;

const Third = styled.div`
  position: absolute;
  top: 19vw;
  right: 30%;
  z-index: 100;
  color: #403d39;
  transform: translate(50%);
`;

const UserName = styled.div`
  font-size: ${({ $length }) => $length / 1.5}vw;
  width: auto;
`;

const End = ({ audioRef, arrayUsers, isPlayBgm }) => {
  const clapRef = useRef(null);
  gsap.registerPlugin(useGSAP);

  useGSAP(() => {
    let tl = gsap.timeline({ delay: 0.5 });

    if (arrayUsers.length >= 3) {
      tl.from(".third", {
        y: -150,
        opacity: 0,
        duration: 0.9,
        ease: "bounce.out",
      });
      tl.add(() => {
        let repeatTl = gsap.timeline({ repeat: -1, delay: 0.5 });
        repeatTl
          .to(".third", {
            y: -40,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.2,
          })
          .to(".third", {
            y: 0,
            duration: 0.5,
            ease: "power2.in",
          });
      });
    }

    if (arrayUsers.length >= 2) {
      tl.from(".second", {
        y: -150,

        opacity: 0,
        duration: 0.9,
        ease: "bounce.out",
      });
      tl.add(() => {
        let repeatTl = gsap.timeline({ repeat: -1, delay: 0.5 });
        repeatTl
          .to(".second", {
            y: -40,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.2,
          })
          .to(".second", {
            y: 0,
            duration: 0.5,
            ease: "power2.in",
          });
      });
    }

    tl.from(".first", {
      y: -150,
      opacity: 0,
      duration: 0.9,
      ease: "bounce.out",
      onComplete: () => {
        isPlayBgm && clapRef.current.play();
      },
    });
    tl.add(() => {
      let repeatTl = gsap.timeline({ repeat: -1, delay: 0.5 });
      repeatTl
        .to(".first", {
          y: -40,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.2,
        })
        .to(".first", {
          y: 0,
          duration: 0.5,
          ease: "power2.in",
        });
    });
    tl.from(".confetti", {
      duration: 5,
      opacity: 0,
    });
  });

  const userNameLength = (length) => {
    if (length >= 8) {
      return 5;
    } else if (length >= 5) {
      return 8;
    }
    return 9;
  };

  return (
    <WrapRank>
      {" "}
      <WrapConfetti className="confetti">
        <Confetti style={{ zIndex: -1, height: 1000 }} />
      </WrapConfetti>
      <WrapPodium>
        {arrayUsers
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((user, index) => {
            if (index === 0) {
              return (
                <First className="first" key={index} $index={index}>
                  <UserName $length={userNameLength(user.name.length)}>
                    {user.name}
                  </UserName>
                </First>
              );
            } else if (index === 1) {
              return (
                <Second className="second" key={index} $index={index}>
                  <UserName $length={userNameLength(user.name.length)}>
                    {user.name}
                  </UserName>
                </Second>
              );
            } else if (index === 2) {
              return (
                <Third className="third" key={index} $index={index}>
                  <UserName $length={userNameLength(user.name.length)}>
                    {user.name}
                  </UserName>
                </Third>
              );
            }
          })}

        <Podium src="/Podium.png" />
      </WrapPodium>
      <audio src="/bgm/clapping.mp3" ref={clapRef} />
      <audio autoPlay src="/bgm/end.mp3" ref={audioRef} />
    </WrapRank>
  );
};

export default End;
