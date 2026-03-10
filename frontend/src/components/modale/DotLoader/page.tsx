import React from "react";
import "./DotLoader.css";

type DotActivityIndicatorProps = {
    size?: number;        // ex: 8, 10, 16 (px)
    color?: string;       // ex: '#198754', 'red'
  };
  
  export default function DotActivityIndicator({
    size = 10,
    color = "#198754",
  }: DotActivityIndicatorProps) {
    return (
      <div className="dot-indicator">
        <span style={{ width: size, height: size, backgroundColor: color }} />
        <span style={{ width: size, height: size, backgroundColor: color }} />
        <span style={{ width: size, height: size, backgroundColor: color }} />
      </div>
    );
  }