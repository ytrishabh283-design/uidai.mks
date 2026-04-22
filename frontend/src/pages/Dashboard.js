import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ECMPReport from "./pages/ECMPReport";
import UCReport from "./pages/UCReport";
import EODRequest from "./pages/EODRequest";
import MissingEOD from "./pages/MissingEOD";
import Wallet from "./pages/Wallet";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/home" />} />

        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="home" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="ecmp-report" element={<ECMPReport />} />
          <Route path="uc-report" element={<UCReport />} />
          <Route path="eod-request" element={<EODRequest />} />
          <Route path="missing-eod" element={<MissingEOD />} />
          <Route path="wallet" element={<Wallet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
