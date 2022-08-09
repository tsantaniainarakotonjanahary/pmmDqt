import React from "react";
import "./spinner.css";

export default function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
      <h1>Veuillez patientez s'il vous plait ...</h1>
    </div>
  );
}
