import theme from "@/components/css/theme";
import React from "react";
import styled from "styled-components";

const WrapPlus = styled.svg`
  width: ${({ $size }) => $size}rem;
  height: ${({ $size }) => $size}rem;
  color: ${theme.colors.secondary};

  ${theme.breakpoints.sm} {
    width: 4rem;
  }
`;

const Plus = ({ size = 6 }) => {
  return (
    <WrapPlus
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      $size={size}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </WrapPlus>
  );
};

export default Plus;
