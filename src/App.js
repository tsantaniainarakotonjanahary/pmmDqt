import MyNavbar from "./MyNavbar";
import Home from "./Home";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dataUser, setDataUser] = useState({});
  const database = [
    {
      username: "Nosybe",
      password: "2021@Covax",
      idOrgUnit: "P7ko8ftfjUy",
    },
    {
      username: "Ambanja_MG",
      password: "2021@Covax",
      idOrgUnit: "Sc9CY4s8DWu",
    },
    {
      username: "Rectifier",
      password: "2021@Covax",
      idOrgUnit: "Sc9CY4s8DWu",
    },
  ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password",
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    var { uname, pass } = document.forms[0];
    const userData = database.find((user) => user.username === uname.value);
    if (userData) {
      if (userData.password !== pass.value) {
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        setIsSubmitted(true);
        setDataUser(userData);
      }
    } else {
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderForm = (
    <div className="app">
      <div className="login-form">
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Username </label>
              <input type="text" name="uname" required />
              {renderErrorMessage("uname")}
            </div>
            <div className="input-container">
              <label>Password </label>
              <input type="password" name="pass" required />
              {renderErrorMessage("pass")}
            </div>
            <div className="button-container">
              <input type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Container>
        <Row>
          <Col md={12}>
            <MyNavbar />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            {isSubmitted
              ? navigate("/Formulaire", {
                  state: dataUser,
                })
              : renderForm}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
