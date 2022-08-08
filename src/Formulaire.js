import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MyNavbar from "./MyNavbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import * as XLSX from "xlsx";
import "./spinner.css";
import LoadingSpinner from "./LoadingSpinner";

function Formulaire() {
  const location = useLocation();
  const [sortie, setSortie] = useState("enrollment");
  const [erreur, setErreur] = useState("doublon");
  const [periode, setPeriode] = useState("LAST_12_MONTHS");
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    var sortieFr = "enrollement";
    if (sortie === "event") {
      var sortieFr = "evenement";
    }
    setLoading(true);
    getData(
      "https://gentle-inlet-74830.herokuapp.com/" + erreur + "-" + sortieFr,
      location.state.username,
      location.state.password,
      periode,
      location.state.idOrgUnit,
      sortie + "s",
      sortie.toUpperCase(),
      sortie + "Date"
    ).then((data) => {
      setData(data);
      setLoading(false);
      exportXLSX(data.data, erreur + "-" + sortieFr, "dataQT");
    });
  };
  return (
    <Container>
      <Row>
        <Col md={12}>
          <MyNavbar />
        </Col>
      </Row>
      <Row>
        <Col md={3}></Col>
        <Col md={6}>
          <Form style={{ marginTop: "50px" }}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="disabledSelect">Type de sortie</Form.Label>
              <Form.Select
                id="disabledSelect"
                value={sortie}
                onChange={(e) => setSortie(e.target.value)}
              >
                <option value="enrollment">enrollment</option>
                <option value="event">event</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="disabledSelect">
                Type d'Erreur a rectifier
              </Form.Label>
              <Form.Select
                id="disabledSelect"
                value={erreur}
                onChange={(e) => setErreur(e.target.value)}
              >
                <option value="doublon">doublon</option>
                <option value="NA">NA</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="disabledSelect">Choix de periode</Form.Label>
              <Form.Select
                id="disabledSelect"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
              >
                <option value="LAST_12_MONTHS">LAST_12_MONTHS</option>
                <option value="THIS_YEAR;LAST_5_YEARS">
                  THIS_YEAR;LAST_5_YEARS
                </option>
                <option value="THIS_YEAR">THIS_YEAR</option>
                <option value="LAST_5_YEARS">LAST_5_YEARS</option>
                <option value="LAST_YEAR">LAST_YEAR</option>
              </Form.Select>
            </Form.Group>
            <Button variant="dark" onClick={handleClick}>
              Telecharger en fichier Excel
            </Button>
          </Form>
        </Col>
        <Col md={3}></Col>
      </Row>
      <Row>{loading ? <LoadingSpinner /> : console.log(data)}</Row>
    </Container>
  );
}

const exportXLSX = (data, sheetName, filename) => {
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename + ".xlsx");
};

const getData = async (
  domain,
  username,
  password,
  periode,
  idOrgUnit,
  sortie,
  outputType,
  sort
) => {
  var data = {
    username: username,
    password: password,
    periode: periode,
    idOrgUnit: idOrgUnit,
    sortie: sortie,
    outputType: outputType,
    sort: sort,
  };

  var url = new URL(domain);
  for (let k in data) {
    url.searchParams.append(k, data[k]);
  }
  console.log(url);
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  return response.json();
};

export default Formulaire;
