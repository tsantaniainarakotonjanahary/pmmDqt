import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Formulaire from "./Formulaire";
import MyNavbar from "./MyNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div className="container-fluid">
    <div className="row">
      <div className="col-md-12">
        <MyNavbar />
      </div>
    </div>
    <div className="row">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/Formulaire" element={<Formulaire />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
    <footer className=" bg-dark d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <p className="col-md-4 mb-0 text-muted">&copy; 2022 Company, Inc</p>
    </footer>
  </div>
);
