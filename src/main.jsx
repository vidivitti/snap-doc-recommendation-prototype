import React from "react";
import { createRoot } from "react-dom/client";
import SnapVerificationPrototype from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SnapVerificationPrototype />
  </React.StrictMode>
);
