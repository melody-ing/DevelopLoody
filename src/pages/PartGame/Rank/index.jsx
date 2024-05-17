import styled from "styled-components";

const WrapRank = styled.div`
  font-size: 2.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 16rem;
  left: 50%;
  transform: translateX(-50%);
`;

const RankTitle = styled.div`
  color: #79663a;
  margin-top: 4rem;
`;

const Star = styled.svg`
  width: 12rem;
  height: 12rem;
  color: #eab539;
  margin-top: 1rem;
`;

const RankNum = styled.div`
  font-size: 4rem;
  font-weight: 700;
  color: #ffffff;
  transform: translate(0, -7rem);
`;

const Rank = ({ users, userId }) => {
  const userRank = Object.entries(users)
    .filter((user) => user[1].isOnline === true)
    .sort(([, a], [, b]) => b.score - a.score);
  const rank = userRank.findIndex(([id]) => id === userId);

  return (
    <WrapRank>
      <RankTitle>排名</RankTitle>
      <Star
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path
          fillRule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
          clipRule="evenodd"
        />
      </Star>

      <RankNum>{rank + 1}</RankNum>
    </WrapRank>
  );
};

export default Rank;
