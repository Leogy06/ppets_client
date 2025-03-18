import React from "react";

import "./loader.css";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 opacity-75 flex justify-center items-center z-50">
      {/* <!-- From Uiverse.io by SouravBandyopadhyay -->  */}
      <div className="hourglassBackground">
        <div className="hourglassContainer">
          <div className="hourglassCurves"></div>
          <div className="hourglassCapTop"></div>
          <div className="hourglassGlassTop"></div>
          <div className="hourglassSand"></div>
          <div className="hourglassSandStream"></div>
          <div className="hourglassCapBottom"></div>
          <div className="hourglassGlass"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
