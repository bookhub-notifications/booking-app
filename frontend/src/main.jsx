import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./index.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  ThemeProvider,
} from "./context/ThemeContext";

import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(
  document.getElementById("app")
).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </ThemeProvider>
  </React.StrictMode>
);