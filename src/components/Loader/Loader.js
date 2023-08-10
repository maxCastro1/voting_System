import React from "react";
import "./spinner.css";

export default function LoadingSpinner({ width, height, border, borderTop,padding }) {
  return (
    <div className="spinner-container" style={{padding}}>
      <div
        className="loading-spinner"
        style={{
          width,
          height,
          border: border ? border : "2px solid #f3f3f3", // Default to light grey border
          borderTop: borderTop ? borderTop : "2px solid #383636", // Default to black top border
        }}
      ></div>
    </div>
  );
}
