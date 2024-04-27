import React from "react";
// import "../../public/friday.css";

const Friday = () => {
  const progress = 40;
  return (
    <div className="container">
      <h1>Year progress</h1>
      <div className="progressbar-container">
        <div className="progressbar-complete" style={{ width: `${progress}%` }}>
          <div className="progressbar-liquid"></div>
        </div>
        <span className="progress">{progress}</span>
      </div>
    </div>
  );
};

export default Friday;
