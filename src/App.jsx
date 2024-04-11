import React from "react";
import { Outlet } from "react-router-dom";
import BaseGlobalStyle from "./components/css/BaseGlobalStyle";

const App = () => {
  return (
    <div>
      <BaseGlobalStyle />
      <Outlet />
    </div>
  );
};

export default App;
