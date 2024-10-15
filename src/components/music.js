import React from 'react';
import i from "../images/m.png";
import "./music.css";

function Music(props) {
  let { title, file } = props;
  return (
    <div className="card">
      <img src={i} className="card-img-top" alt="Music Cover" />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div className="audio">
          <audio controls className="audio1">
            <source src={file} />
          </audio>
        </div>
        <div className="controls">
          <span className="control-btn">⏮️</span>
          <span className="control-btn">⏯️</span>
          <span className="control-btn">⏭️</span>
        </div>
      </div>
    </div>
  );
}

export default Music;
