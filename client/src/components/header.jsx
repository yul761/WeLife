import React, { Component } from "react";
import Logo from "../assets/icon/Logo.png";
import Logo__2 from "../assets/icon/Logo-black.png";
import { Link } from "react-router-dom";

export default class header extends Component {
  constructor() {
    super();
    this.state = { curPath: "/community" };
  }

  componentDidUpdate() {
    console.log(`the props passed into header is ${this.props.current}`);
    if (this.state.curPath !== this.props.current) {
      console.log("Setting the state");
      this.setState({ curPath: this.props.current });
      console.log("Done setting state");
    }

    console.log(`the curPath state is : ${this.state.curPath}`);

    this.manageNavLink();
  }

  manageNavLink = () => {
    if (this.state.curPath === "/community") {
      console.log("Current page is Community page");
      // let community = document.getElementsByClassName("header__community")[0];
      // community.style.backgroundColor = "rgba(82, 75, 75, 0.7)";
      // let record = document.getElementsByClassName("header__gif")[0];
      // record.style.backgroundColor = "#323232";
      // record.onmouseover = () => {
      //   record.style.backgroundColor = "rgba(82, 75, 75, 0.7)";
      // };
      // record.onmouseleave = () => {
      //   record.style.backgroundColor = "#323232";
      // };
    } else if (this.state.curPath === "/gif") {
      // let community = document.getElementsByClassName("header__community")[0];
      // community.style.backgroundColor = "#323232";
      // community.onmouseover = () => {
      //   community.style.backgroundColor = "rgba(82, 75, 75, 0.7)";
      // };
      // community.onmouseleave = () => {
      //   community.style.backgroundColor = "#323232";
      // };
      // let record = document.getElementsByClassName("header__gif")[0];
      // record.style.backgroundColor = "rgba(82, 75, 75, 0.7)";
      console.log("Current page is GIf generate page");
    }
  };
  render() {
    return (
      <div>
        <div className="header">
          <div className="header__logo">
            <img className="header__logo-icon" alt="logo" src={Logo__2}></img>
          </div>
          <div className="mobile__wrapper">
            <Link to="/community" className="header__link header__community">
              <div className="header__community">
                <div className="header__community-label">COMMUNITY</div>
              </div>
            </Link>
            <Link to="/gif" className="header__link header__gif">
              <div className="header__recording">
                <div className="header__recording-label">RECORDING</div>
              </div>
            </Link>
          </div>
        </div>
        <hr className="header__seperater"></hr>
      </div>
    );
  }
}
