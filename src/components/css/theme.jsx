const theme = {
  breakpoints: {
    lg: "@media screen and (min-width:1921px)",
    md: "@media screen and (max-width:1280px)",
    sm: "@media screen and (max-width:768px)",
    xs: "@media screen and (max-width:480px)",
    xxs: "@media screen and (max-width:320px)",
  },
  colors: {
    primary: "#EBDB86", // 主色調,淺黃色
    secondary: "#996484", // 輔助色,褐紫色
    tertiary: "#664358",
    success: "#78B159", // 成功、正面的綠色
    danger: "#d65749", // 警示、錯誤的紅色
    warning: "#F6BD30", // 提醒、警告的橘黃色
    info: "#3f3a3a", // 資訊的深灰色
    light: "#F5F2F0", // 背景、淺色元素的米白
    dark: "#262424", // 文字、深色元素的黑色
  },
};

export default theme;
