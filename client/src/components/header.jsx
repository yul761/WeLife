import React, { Component } from "react";
import Left from "../assets/icon/left-arrow.png";
import Right from "../assets/icon/right-arrow.png";
import Logo from "../assets/icon/Logo.png";

export default class header extends Component {
  render() {
    return (
      <div>
        <div className="header">
          <div className="header__leftArrow">
            <img
              className="header__leftArrow-icon"
              alt="left arrow"
              src={Left}
            ></img>
          </div>

          <div className="header__logo">
            <img className="header__logo-icon" alt="logo" src={Logo}></img>
          </div>
          <div className="header__rightArrow">
            <img
              className="header__rightArrow-icon"
              alt="right arrow"
              src={Right}
            ></img>
          </div>
        </div>
        <hr className="header__seperater"></hr>
      </div>
    );
  }
}
