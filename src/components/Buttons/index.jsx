import React from "react";
import theme from "../css/theme";
import styled from "styled-components";

// <Buttons type="light">主持</Buttons>

const Button = styled.div`
  ${({ $bg, $color, $hoverbg, $width }) =>
    `background-color: ${$bg}; color: ${$color}; &:hover{ background-color:${$hoverbg}}; width: ${$width}rem; box-shadow: 0 3.4px 0px 0 ${$hoverbg}; `};
  height: 4rem;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;

  p {
    letter-spacing: 1.2rem;
    transform: translate(0.6rem);
  }
`;

const Buttons = ({ children, type, size = "default" }) => {
  // type secondary :#996484
  // type light :#F5F2F0
  // type success :#78B159
  // type danger :#D65749
  let bg = "";
  let color = "";
  let hoverbg = "";
  let width = "";
  let height = "";

  switch (type) {
    case "light":
      bg = `${theme.colors.light}`;
      color = `${theme.colors.dark}`;
      hoverbg = `#a5a4a4`;

      break;
    case "success":
      bg = `${theme.colors.success}`;
      color = `${theme.colors.light}`;
      hoverbg = `${theme.colors.info}`;

      break;
    case "danger":
      bg = `${theme.colors.danger}`;
      color = `${theme.colors.light}`;
      hoverbg = `${theme.colors.info}`;

      break;
    default:
      bg = `${theme.colors.secondary}`;
      color = `${theme.colors.light}`;
      hoverbg = `${theme.colors.tertiary}`;
      break;
  }

  switch (size) {
    case "small":
      width = "8";

      break;

    case "medium":
      width = "10";
      height = "4";

      break;

    case "large":
      width = "20";

      break;
    default:
      width = "10";
      break;
  }

  return (
    <Button
      $size={size}
      $bg={bg}
      $color={color}
      $hoverbg={hoverbg}
      $width={width}
    >
      <p>{children}</p>
    </Button>
  );
};

export default Buttons;
