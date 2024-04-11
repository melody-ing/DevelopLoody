import React from "react";
import { Button, ConfigProvider } from "antd";
import theme from "../globals/theme";

// <Buttons type="light">主持</Buttons>

const Buttons = ({ children, type }) => {
  // type secondary :#996484
  // type light :#F5F2F0
  // type success :#78B159
  // type danger :#D65749
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

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorBgContainer: bg,
              defaultColor: color,
              defaultBorderColor: `none`,
              defaultHoverBg: hoverbg,
              defaultHoverBorderColor: `none`,
              defaultHoverColor: color,
              defaultActiveBg: hoverbg,
              defaultActiveBorderColor: "none",
              defaultActiveColor: color,
              defaultShadow: `0 3px 0 ${hoverbg}`,
            },
          },
        }}
      >
        <Button>{children}</Button>
      </ConfigProvider>
    </div>
  );
};

export default Buttons;
