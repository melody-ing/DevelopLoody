import React from "react";
import { Button, ConfigProvider } from "antd";
import theme from "../globals/theme";

// <Buttons type={1}>主持</Buttons>

const Buttons = ({ children, type = 2 }) => {
  // type 1 :#996484
  // type 2 :#F5F2F0
  // type 3 :#78B159
  // type 4 :#D65749
  let bg = "";
  let color = "";
  let hoverbg = "";
  if (type === 1) {
    bg = `${theme.colors.secondary}`;
    color = `${theme.colors.light}`;
    hoverbg = `${theme.colors.tertiary}`;
  } else if (type === 2) {
    bg = `${theme.colors.light}`;
    color = `${theme.colors.dark}`;
    hoverbg = `#a5a4a4`;
  } else if (type === 3) {
    bg = `${theme.colors.success}`;
    color = `${theme.colors.light}`;
    hoverbg = `${theme.colors.info}`;
  } else if (type === 4) {
    bg = `${theme.colors.danger}`;
    color = `${theme.colors.light}`;
    hoverbg = `${theme.colors.info}`;
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
