import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import logo from "./logo.jpeg";

import "bootstrap/dist/css/bootstrap.min.css";

function MyNavbar() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={logo}
              width="300"
              height="80"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavbar;
