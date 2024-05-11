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
  font-weight: 500;
  font-size: 1.6rem;
  text-align: center;
  color: ${theme.colors.info};
  line-height: 2.4rem;
}

ul,
ol {
  list-style: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

main {
  min-height: 100vh;
}

a {
  color: inherit;
  text-decoration: none;
}

h1{
  font-size: 6.4rem;
  font-weight: 700;
  line-height: 9.6rem;
}

h2{
  font-size: 4.8rem;
  font-weight: 500;
  line-height: 7.2rem;
  margin-bottom: 1.6rem;
}

h3{
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 3.6rem;
}

img{
  width: 100%;
}

input{
  height: 4rem;
  width: 100%;
  border: 1px solid #ccc;
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
