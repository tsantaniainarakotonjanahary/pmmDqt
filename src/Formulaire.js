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
import { Footer } from "./Footer";
import Table from "react-bootstrap/Table";
import { CDBTable, CDBTableHeader, CDBTableBody, CDBContainer } from "cdbreact";
import {
  CDBSidebar,
  CDBSidebarHeader,
  CDBSidebarMenuItem,
  CDBSidebarContent,
  CDBSidebarMenu,
  CDBSidebarSubMenu,
  CDBSidebarFooter,
} from "cdbreact";

function Formulaire() {
  const location = useLocation();
  const [sortie, setSortie] = useState("enrollment");
  const [idOrgUnit, setIdOrgUnit] = useState("P7ko8ftfjUy");
  const [erreur, setErreur] = useState("doublon");
  const [periode, setPeriode] = useState("LAST_12_MONTHS");
  const [data, setData] = useState({ headers: { length: 0 } });
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    var sortieFr = "enrollement";
    if (sortie === "event") {
      sortieFr = "evenement";
    }
    setData({ headers: { length: 0 } });
    setLoading(true);
    getData(
      "https://gentle-inlet-74830.herokuapp.com/" + erreur + "-" + sortieFr,
      "Nosybe",
      "2021@Covax",
      periode,
      idOrgUnit,
      sortie + "s",
      sortie.toUpperCase(),
      sortie + "Date"
    ).then((data) => {
      setData(data);
      setLoading(false);
    });
  };

  const handleDownload = () => {
    var sortieFr = "enrollement";
    if (sortie === "event") {
      sortieFr = "evenement";
    }
    setLoading(true);
    exportXLSX(data.data, erreur + "-" + sortieFr, data.headers);
    setLoading(false);
  };

  return (
    <div>
      <Row>
        <Col md={12}>
          <MyNavbar />
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <CDBSidebar>
            <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>
              Menu
            </CDBSidebarHeader>
            <CDBSidebarContent>
              <CDBSidebarMenu>
                <CDBSidebarMenuItem icon="exclamation-circle">
                  Analyse d'erreur
                </CDBSidebarMenuItem>

                <CDBSidebarMenuItem icon="sign-out-alt" iconType="solid">
                  Deconnecter
                </CDBSidebarMenuItem>
              </CDBSidebarMenu>
            </CDBSidebarContent>

            <CDBSidebarFooter style={{ textAlign: "center" }}>
              <div
                className="sidebar-btn-wrapper"
                style={{ padding: "20px 5px" }}
              >
                Sidebar Footer
              </div>
            </CDBSidebarFooter>
          </CDBSidebar>
        </Col>
        <Col md={2} className="me-5">
          <Form style={{ marginTop: "50px" }}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="disabledSelect">District</Form.Label>
              <Form.Select
                id="disabledSelect"
                value={idOrgUnit}
                onChange={(e) => {
                  setIdOrgUnit(e.target.value);
                  setData({ headers: { length: 0 } });
                }}
              >
                <option value="Sc9CY4s8DWu">Ambanja</option>
                <option value="P7ko8ftfjUy">Nosy Be</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="disabledSelect">Type de sortie</Form.Label>
              <Form.Select
                id="disabledSelect"
                value={sortie}
                onChange={(e) => {
                  setSortie(e.target.value);
                  setData({ headers: { length: 0 } });
                }}
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
                onChange={(e) => {
                  setErreur(e.target.value);
                  setData({ headers: { length: 0 } });
                }}
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
                onChange={(e) => {
                  setPeriode(e.target.value);
                  setData({ headers: { length: 0 } });
                }}
              >
                <option value="LAST_12_MONTHS">12 dernier mois</option>
                <option value="THIS_YEAR;LAST_5_YEARS">2021-2022</option>
                <option value="THIS_YEAR;LAST_5_YEARS">
                  5 dernieres annees
                </option>
                <option value="THIS_YEAR">cette année</option>
                <option value="LAST_5_YEARS">5 dernieres annees</option>
                <option value="LAST_YEAR">Année derniere</option>
              </Form.Select>
            </Form.Group>

            <Button variant="dark" onClick={handleClick}>
              Consulter
            </Button>
          </Form>
          <Row>{loading && <LoadingSpinner />}</Row>
        </Col>
        <Col md={6}>
          <Row
            style={{ textAlign: "center", alignItems: "center" }}
            className="my-3"
          >
            <Col md="4"></Col>

            <Col md="3">
              <Button
                icon="arrow-circle-down"
                iconType="solid"
                onClick={handleDownload}
                className="btn btn-dark"
              >
                Telecharger
              </Button>
            </Col>
            <Col md="4"></Col>
          </Row>
          <Row>
            {data.headers.length !== 0 && (
              <CDBContainer style={{ height: "700px", "overflow-y": "scroll" }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      {data.headers.map((item) => {
                        return <th>{item}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody responsive>
                    {data.data.map((item) => {
                      return (
                        <tr>
                          {item.map((value) => {
                            return <td>{value}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CDBContainer>
            )}
          </Row>
        </Col>
      </Row>
      <Footer />
    </div>
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
