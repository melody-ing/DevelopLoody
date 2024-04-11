import { createGlobalStyle } from "styled-components";
import theme from "./theme";

const BaseGlobalStyle = createGlobalStyle`

/***** base *****/

* {
  margin: 0;
  box-sizing: border-box;
  font-family: "Noto Sans TC", sans-serif;
}

html {
  margin: 0 auto;
  font-size: 62.5%;
}

body {
  font-weight: 400;
  font-size: 2rem;
  text-align: center;
  color: ${theme.colors.info};
  line-height: 2rem;
}

ul,
ol {
  list-style: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}



main {
  min-height: 100vh;
}

hr {
  height: 2rem;
  border: 1px solid ${theme.colors.info};
}

.hide {
  display: none;
}

${theme.breakpoints.sm} {
  hr {
    height: 1.6rem;
  }

  header {
    margin-bottom: 1.5rem;
  }

  body {
    font-size: 1.6rem;
  }
}
`;

export default BaseGlobalStyle;
