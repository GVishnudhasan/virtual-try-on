import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import SoulSerumAR from "./components/foundationOverride";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/serum-try-on" element={<SoulSerumAR />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
