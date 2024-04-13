import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Part from "./pages/Part/index.jsx";
import Host from "./pages/Host/index.jsx";
import Home from "./pages/Home/index.jsx";
import HostGame from "./pages/HostGame/index.jsx";
import PartGame from "./pages/PartGame/index.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="host" element={<Host />} />
        <Route path="host/game" element={<HostGame />} />
        <Route path="part" element={<Part />} />
        <Route path="part/game" element={<PartGame />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
