import React from "react";
import "./spinner.css";

export default function LoadingSpinner() {
  return (
    <div className="spinner-container my-5">
      <div className="loading-spinner"></div>
      <h1>Veuillez patientez s'il vous plait ...</h1>
    </div>
  );
}
