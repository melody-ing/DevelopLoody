import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Part from "./pages/Part/index.jsx";
import Host from "./pages/Host/index.jsx";
import Entry from "./pages/Entry/index.jsx";
import HostGame from "./pages/HostGame/index.jsx";
import PartGame from "./pages/PartGame/index.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashBoard from "./pages/DashBoard/index.jsx";
import Create from "./pages/Create";
import Home from "./pages/Home/index.jsx";
import AiGenerate from "./pages/AiGenerate/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="entry" element={<Entry />} />
        <Route path="aigenerate" element={<AiGenerate />} />
        <Route path="host/:documentId/:pin" element={<Host />} />
        <Route path="hostgame/:documentId" element={<HostGame />} />
        <Route path="part/:documentId/:pin" element={<Part />} />
        <Route path="partgame/:documentId" element={<PartGame />} />
        <Route path="dashboard" element={<DashBoard />} />
        <Route path="create/:documentId" element={<Create />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
