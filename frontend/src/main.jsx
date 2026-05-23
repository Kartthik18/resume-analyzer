// ──────────────────────────────────────────────────────
//  main.jsx  —  React app entry point
//  Mounts the App component into the DOM
// ──────────────────────────────────────────────────────

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Global Tailwind styles

// Mount the React app into the <div id="root"> in index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
