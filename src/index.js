import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const BASE_PATH = process.env.PUBLIC_URL || "/indicators"; // or any subdirectory you're using

ReactDOM.render(
  <BrowserRouter basename={BASE_PATH}>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
