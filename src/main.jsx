import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Part from "./pages/Part/index.jsx";
import Host from "./pages/Host/index.jsx";
import Home from "./pages/Home/index.jsx";
import HostGame from "./pages/HostGame/index.jsx";
import PartGame from "./pages/PartGame/index.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/DashBoard/index.jsx";
import Create from "./pages/Create/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="host/:documentId/:pin" element={<Host />} />
        <Route path="host/game/:documentId" element={<HostGame />} />
        <Route path="part/:documentId" element={<Part />} />
        <Route path="part/game/:documentId" element={<PartGame />} />
        <Route path="dashboard/:userId" element={<DashBoard />} />
        <Route path="create/:userId/:documentId" element={<Create />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
