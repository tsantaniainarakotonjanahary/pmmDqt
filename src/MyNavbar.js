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
          <Navbar.Brand href="#home"></Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavbar;
