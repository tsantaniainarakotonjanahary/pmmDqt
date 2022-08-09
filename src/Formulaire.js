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
  const [data, setData] = useState({ headers: { length: 0 } });
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    var sortieFr = "enrollement";
    if (sortie === "event") {
      sortieFr = "evenement";
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
      exportXLSX(data.data, erreur + "-" + sortieFr, data.headers);
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
                <option value="enrollment">Enrollement</option>
                <option value="event">Evenement</option>
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
                <option value="doublon">Doublon</option>
                <option value="NA">Non-Appliquable</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="disabledSelect">Choix de periode</Form.Label>
              <Form.Select
                id="disabledSelect"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
              >
                <option value="LAST_12_MONTHS">12 dernier mois</option>
                <option value="THIS_YEAR;LAST_5_YEARS">
                  cette année et les 5 dernieres annees
                </option>
                <option value="THIS_YEAR">cette année</option>
                <option value="LAST_5_YEARS">5 dernieres annees</option>
                <option value="LAST_YEAR">Année derniere</option>
              </Form.Select>
            </Form.Group>
            <Button variant="dark" onClick={handleClick}>
              Telecharger en fichier Excel
            </Button>
          </Form>
        </Col>
        <Col md={3}></Col>
      </Row>
      <Row>{loading && <LoadingSpinner />}</Row>
    </Container>
  );
}

const exportXLSX = (data, sheetName, headers) => {
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.sheet_add_aoa(ws, [headers]);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, sheetName + "_" + new Date().toISOString() + ".xlsx");
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
