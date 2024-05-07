const theme = {
  breakpoints: {
    lg: "@media screen and (min-width:1921px)",
    md: "@media screen and (max-width:1280px)",
    sm: "@media screen and (max-width:940px)",
    xs: "@media screen and (max-width:480px)",
    xxs: "@media screen and (max-width:320px)",
  },
  colors: {
    primary: "#ebdb86", // 主色調,淺黃色
    secondary: "#80546f", // 輔助色,褐紫色
    tertiary: "#664358",
    success: "#648951", // 成功、正面的綠色
    danger: "#91453d", // 警示、錯誤的紅色
    warning: "#F6BD30", // 提醒、警告的橘黃色
    info: "#3f3a3a", // 資訊的深灰色
    light: "#f5f4f0", // 背景、淺色元素的米白
    dark: "#363232", // 文字、深色元素的黑色
  },
  shadow: "0px 3px 6px 0px #3333333e",
};

export default theme;
