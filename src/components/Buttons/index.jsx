import theme from "../css/theme";
import styled from "styled-components";

// <Buttons type="light">主持</Buttons>

const Button = styled.div`
  width: ${({ $size }) => $size}rem;
  color: ${({ $color }) => $color};
  background-color: ${({ $bg }) => $bg};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  box-shadow: 0 3.4px 0 0 ${({ $hoverbg }) => $hoverbg};
  font-size: ${({ $size }) => ($size * 2) / 10}rem;
  height: ${({ $size }) => $size / 2.4}rem;
  cursor: ${({ $type }) => $type !== "invalid" && "pointer"};

  &:hover {
    background-color: ${({ $hoverbg }) => $hoverbg};
  }

  ${theme.breakpoints.md} {
    width: ${({ $size }) => $size * 0.9}rem;
    font-size: ${({ $size }) => (($size * 2) / 10) * 0.95}rem;
    height: ${({ $size }) => ($size / 2.4) * 0.9}rem;
  }
  ${theme.breakpoints.sm} {
    width: ${({ $size }) => $size * 0.7}rem;
    font-size: ${({ $size }) => (($size * 2) / 10) * 0.9}rem;
    height: ${({ $size }) => $size / 2.4}rem;
  }
`;

const ButtonContent = styled.p`
  letter-spacing: 1.2rem;
  transform: translate(0.6rem);
`;

const Buttons = ({ children, type, size = "default", style, onClick }) => {
  // type secondary :#996484
  // type light :#F5F2F0
  // type success :#78B159
  // type danger :#D65749
  // type invalid
  let bg = "";
  let color = "";
  let hoverbg = "";

  switch (type) {
    case "light":
      bg = `${theme.colors.light}`;
      color = `${theme.colors.dark}`;
      hoverbg = `#a5a4a4`;

      break;
    case "success":
      bg = `${theme.colors.success}`;
      color = `${theme.colors.light}`;
      hoverbg = "#33432b";

      break;
    case "danger":
      bg = `${theme.colors.danger}`;
      color = `${theme.colors.light}`;
      hoverbg = `${theme.colors.info}`;

      break;

    case "invalid":
      bg = `#a5a4a4`;
      color = `${theme.colors.light}`;
      hoverbg = `#a5a4a4`;
      break;

    default:
      bg = `${theme.colors.secondary}`;
      color = `${theme.colors.light}`;
      hoverbg = `${theme.colors.tertiary}`;
      break;
  }

  switch (size) {
    case "small":
      size = "8";

      break;

    case "medium":
      size = "10";

      break;

    case "large":
      size = "14";

      break;

    case "sound":
      size = "15";
      break;

    default:
      size = "10";
      break;
  }

  return (
    <Button
      $type={type}
      $bg={bg}
      $color={color}
      $hoverbg={hoverbg}
      $size={size}
      style={style}
      onClick={onClick}
    >
      <ButtonContent>{children}</ButtonContent>
    </Button>
  );
};

export default Buttons;
