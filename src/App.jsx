import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import BaseGlobalStyle from "./components/css/BaseGlobalStyle";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div>
      <BaseGlobalStyle />
      <Outlet />
      <ToastContainer />
    </div>
  );
};

export default App;
