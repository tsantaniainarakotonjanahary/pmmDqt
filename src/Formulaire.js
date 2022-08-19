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
import Select from "react-select";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {
  CDBSidebar,
  CDBSidebarHeader,
  CDBSidebarMenuItem,
  CDBSidebarContent,
  CDBSidebarMenu,
  CDBSidebarFooter,
} from "cdbreact";

function Formulaire() {
  const [sortie, setSortie] = useState("enrollment");
  const [region, setRegion] = useState({
    value: "O5FeT4g4GOV",
    label: "Tous",
  });

  const [orgUnit, setOrgUnit] = useState({
    value: region.value,
    label: "Tous",
    link: region.value,
  });

  const [erreur, setErreur] = useState("doublon");
  const [periode, setPeriode] = useState("LAST_12_MONTHS");
  const [data, setData] = useState({ headers: { length: 0 } });
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setData({ headers: { length: 0 } });
    setLoading(true);
    const url =
      "https://gentle-inlet-74830.herokuapp.com/" + erreur + "-" + sortie;
    getData(
      url,
      "Nosybe",
      "2021@Covax",
      periode,
      orgUnit.value,
      sortie + "s",
      sortie.toUpperCase(),
      sortie + "Date"
    ).then((data) => {
      setData(data);
      setLoading(false);
    });
    console.log(url);
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

  const filteredOptions = options.filter((o) => o.link === region.value);

  return (
    <div>
      <Row style={{ height: "850px" }}>
        <Col md={2} className="me">
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
              ></div>
            </CDBSidebarFooter>
          </CDBSidebar>
        </Col>
        <Col md={2} className="me-5">
          <Form style={{ marginTop: "100px", marginBottom: "50px" }}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="disabledSelect">Region</Form.Label>
              <Select
                options={optionsRegion}
                value={region}
                onChange={(selectedOption) => {
                  setRegion(selectedOption);
                  setOrgUnit({
                    value: selectedOption.value,
                    label: "Tous",
                    link: selectedOption.value,
                  });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="disabledSelect">District</Form.Label>
              <Select
                options={filteredOptions}
                value={orgUnit}
                onChange={(selectedOption) => {
                  setOrgUnit(selectedOption);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="disabledSelect">Type de sortie</Form.Label>
              <Form.Select
                id="disabledSelect"
                value={sortie}
                onChange={(e) => {
                  setSortie(e.target.value);
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
          <Row>
            <Col md={2}></Col>
            <Col md={8}>
              {loading ? (
                <LoadingSpinner />
              ) : (
                data.headers.length !== 0 && (
                  <h1>
                    Resultats : <span>{data.data.length}</span>
                  </h1>
                )
              )}
            </Col>
            <Col md={2}></Col>
          </Row>
        </Col>
        <Col md={7}>
          <Row
            style={{ textAlign: "center", alignItems: "center" }}
            className="my-3"
          >
            <Col md="4"></Col>

            <Col md="3">
              {data.headers.length !== 0 && (
                <Button
                  icon="arrow-circle-down"
                  onClick={handleDownload}
                  className="btn btn-dark"
                >
                  Telecharger
                </Button>
              )}
            </Col>
            <Col md="4"></Col>
          </Row>
          <Row>
            {data.headers.length !== 0 ? (
              <div
                style={{
                  height: "700px",
                  width: "1500px",
                  "overflow-y": "scroll",
                }}
              >
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
              </div>
            ) : (
              loading && (
                <>
                  <Box sx={{ width: 1000 }}>
                    <Skeleton sx={{ height: 50 }} />
                    <Skeleton animation="wave" sx={{ height: 50 }} />
                    <Skeleton animation={false} sx={{ height: 50 }} />
                    <Skeleton sx={{ height: 50 }} />
                    <Skeleton animation="wave" sx={{ height: 50 }} />
                    <Skeleton animation={false} sx={{ height: 50 }} />
                    <Skeleton sx={{ height: 50 }} />
                    <Skeleton animation="wave" sx={{ height: 50 }} />
                    <Skeleton animation={false} sx={{ height: 50 }} />
                    <Skeleton sx={{ height: 50 }} />
                    <Skeleton animation="wave" sx={{ height: 50 }} />
                    <Skeleton animation={false} sx={{ height: 50 }} />
                  </Box>
                </>
              )
            )}
          </Row>
        </Col>
      </Row>
      <Footer bg="dark" />
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

const optionsRegion = [
  { value: "MskGiUGbWJ8", label: "Alaotra Mangoro" },
  { value: "kPG7EKqojrg", label: "Amoron'i Mania" },
  { value: "I9lEj4mALls", label: "Analamanga" },
  { value: "l3DKJQGIOwr", label: "Analanjirofo" },
  { value: "M0U5qF1l1ew", label: "Androy" },
  { value: "PTqLWwjcAox", label: "Anosy" },
  { value: "EzHpSGmTzSB", label: "Atsimo Andrefana" },
  { value: "HLuIxUgou3Z", label: "Atsimo Atsinanana" },
  { value: "wR0PL2iap0s", label: "Atsinanana" },
  { value: "gHNBsfuG0Cz", label: "Betsiboka" },
  { value: "A8UMJuP8iI3", label: "Boeny" },
  { value: "jrFvjsPtJrT", label: "Bongolava" },
  { value: "zJ9UJ7RhCwV", label: "Diana" },
  { value: "MH5KHIQYZfs", label: "Fitovinany" },
  { value: "kgGIXgdG56r", label: "Haute Matsiatra" },
  { value: "BwCu0NhYViZ", label: "Ihorombe" },
  { value: "yyl4hZmgoC8", label: "Itasy" },
  { value: "wRAhGd81ae1", label: "Melaky" },
  { value: "YcjoRK39FIy", label: "Menabe" },
  { value: "UYN92RXF3zu", label: "Sava" },
  { value: "HurBrymbN1S", label: "Sofia" },
  { value: "OLNpyBROkUv", label: "Vakinankaratra" },
  { value: "O0yrAFTjghG", label: "Vatovavy" },
];

const options = [
  {
    value: "SLCujLM3Qf5",
    label: "Ambalavao",
  },
  {
    value: "Sc9CY4s8DWu",
    label: "Ambanja",
  },
  {
    value: "a0dxbfYOh2E",
    label: "Ambatoboeny",
    link: "A8UMJuP8iI3",
  },
  {
    value: "obsFQeNciQM",
    label: "Ambatofinandrahana",
    link: "kPG7EKqojrg",
  },
  {
    value: "ZXSURViEsc8",
    label: "Ambatolampy",
  },
  {
    value: "MSvQtBZCz2k",
    label: "Ambatomainty",
  },
  {
    value: "lsCrRfgm2hS",
    label: "Ambatondrazaka",
    link: "MskGiUGbWJ8",
  },
  {
    value: "AdjFsUNV4Xg",
    label: "Ambilobe",
  },
  {
    value: "LmT9KkUIixj",
    label: "Amboasary Sud",
    link: "PTqLWwjcAox",
  },
  {
    value: "ggEW9io9OxW",
    label: "Ambohidratrimo",
    link: "I9lEj4mALls",
  },
  {
    value: "T134N4T4e5s",
    label: "Ambohimahasoa",
  },
  {
    value: "QYXSay8tVtX",
    label: "Ambositra",
    link: "kPG7EKqojrg",
  },
  {
    value: "AS8mYWl1Ael",
    label: "Ambovombe Androy",
    link: "M0U5qF1l1ew",
  },
  {
    value: "evhrYdQYOhK",
    label: "Ampanihy Ouest",
    link: "EzHpSGmTzSB",
  },
  {
    value: "IsROud9LtOF",
    label: "Amparafaravola",
    link: "MskGiUGbWJ8",
  },
  {
    value: "iMfNV2a3DF6",
    label: "Analalava",
  },
  {
    value: "R4b2zHKwMWZ",
    label: "Andapa",
  },
  {
    value: "RGATf8waYNn",
    label: "Andilamena",
    link: "MskGiUGbWJ8",
  },
  {
    value: "dsDbxSkO1ST",
    label: "Andramasina",
    link: "I9lEj4mALls",
  },
  {
    value: "O4fHBBYcppz",
    label: "Anjozorobe",
    link: "I9lEj4mALls",
  },
  {
    value: "UfioceyRxa9",
    label: "Ankazoabo Atsimo",
    link: "EzHpSGmTzSB",
  },
  {
    value: "ugusypQK3oV",
    label: "Ankazobe",
  },
  {
    value: "JChr4ml1sQq",
    label: "Anosibe An'ala",
    link: "MskGiUGbWJ8",
  },
  {
    value: "GfT85pagjDs",
    label: "Antalaha",
  },
  {
    value: "IzwpDjPR8jC",
    label: "Antanambao Manampontsy",
    link: "wR0PL2iap0s",
  },
  {
    value: "TVIEjEecwXO",
    label: "Antananarivo Atsimondrano",
    link: "I9lEj4mALls",
  },
  {
    value: "o2UdRXl7kjG",
    label: "Antananarivo Avaradrano",
    link: "I9lEj4mALls",
  },
  {
    value: "FAuW9yTuH1C",
    label: "Antananarivo Renivohitra",
    link: "I9lEj4mALls",
  },
  {
    value: "i9cs7xTUmQa",
    label: "Antanifotsy",
  },
  {
    value: "qsoWFqtdF9j",
    label: "Antsalova",
  },
  {
    value: "jexxZljmEU6",
    label: "Antsirabe I",
  },
  {
    value: "WxDgNSFrAzU",
    label: "Antsirabe II",
  },
  {
    value: "StRGYBbsLRy",
    label: "Antsiranana I",
  },
  {
    value: "s3HejcPkUeJ",
    label: "Antsiranana II",
  },
  {
    value: "dMfFYzKMRmg",
    label: "Antsohihy",
  },
  {
    value: "Ur9zMVj3DdJ",
    label: "Arivonimamo",
  },
  {
    value: "l6uPphUTDyo",
    label: "Bealanana",
  },
  {
    value: "mIvN6dmW7eP",
    label: "Befandriana Avaratra",
  },
  {
    value: "VWqIMzSkNkh",
    label: "Befotaka",
    link: "HLuIxUgou3Z",
  },
  {
    value: "rYaR81ZVhmJ",
    label: "Bekily",
    link: "M0U5qF1l1ew",
  },
  {
    value: "QSzkjcwpp8g",
    label: "Belo Sur Tsiribihina",
  },
  {
    value: "w5xK0GbJ02o",
    label: "Beloha Androy",
    link: "M0U5qF1l1ew",
  },
  {
    value: "uXvrYne0BTU",
    label: "Benenitra",
    link: "EzHpSGmTzSB",
  },
  {
    value: "wJeSZ3qcPrF",
    label: "Beroroha",
    link: "EzHpSGmTzSB",
  },
  {
    value: "rCmTq0Aaj9Z",
    label: "Besalampy",
  },
  {
    value: "yR491ce4ykk",
    label: "Betafo",
  },
  {
    value: "pQianXyfoBK",
    label: "Betioky Atsimo",
    link: "EzHpSGmTzSB",
  },
  {
    value: "FKedfhqbnhh",
    label: "Betroka",
    link: "PTqLWwjcAox",
  },
  {
    value: "W1wJlEvkkQ9",
    label: "Boriziny (Port Berge)",
  },
  {
    value: "FcdNA0dnLPs",
    label: "Fandriana",
    link: "kPG7EKqojrg",
  },
  {
    value: "q1UVmqTAP0Q",
    label: "Farafangana",
    link: "HLuIxUgou3Z",
  },
  {
    value: "ELJybAM1Qww",
    label: "Faratsiho",
  },
  {
    value: "m0q2KapeNtR",
    label: "Fenoarivo Atsinanana",
    link: "l3DKJQGIOwr",
  },
  {
    value: "IzOuitPxdCW",
    label: "Fenoarivobe",
    link: "jrFvjsPtJrT",
  },
  {
    value: "kcOJ0lo0BWi",
    label: "Fianarantsoa I",
  },
  {
    value: "qmBVgU1eL4R",
    label: "Iakora",
  },
  {
    value: "VtP4BdCeXIo",
    label: "Ifanadiana",
  },
  {
    value: "mweNf27gPF9",
    label: "Ihosy",
  },
  {
    value: "Y3c0TJ0yar4",
    label: "Ikalamavony",
  },
  {
    value: "NhHHkQTICLC",
    label: "Ikongo (Fort_Carnot)",
  },
  {
    value: "X3Uq9Y4qqyd",
    label: "Isandra",
  },
  {
    value: "b6KVcdclMY1",
    label: "Ivohibe",
  },
  {
    value: "jcFrOWmXoXI",
    label: "Kandreho",
    link: "gHNBsfuG0Cz",
  },
  {
    value: "QIBT6jU5eIi",
    label: "Lalangina",
  },
  {
    value: "SrAluezWP64",
    label: "Maevatanana",
    link: "gHNBsfuG0Cz",
  },
  {
    value: "AH15fnbv1S4",
    label: "Mahabo",
  },
  {
    value: "GvoWc7X6Sbp",
    label: "Mahajanga I",
    link: "A8UMJuP8iI3",
  },
  {
    value: "cJHysjcZBUt",
    label: "Mahajanga II",
    link: "A8UMJuP8iI3",
  },
  {
    value: "JLet7EE9HeG",
    label: "Mahanoro",
    link: "wR0PL2iap0s",
  },
  {
    value: "xIkVBGKnqcc",
    label: "Maintirano",
  },
  {
    value: "GTmHmMeVzaw",
    label: "Mampikony",
  },
  {
    value: "fm9l2rMlGIV",
    label: "Manakara Atsimo",
  },
  {
    value: "xPYchJTTSA1",
    label: "Mananara Avaratra",
    link: "l3DKJQGIOwr",
  },
  {
    value: "Qv7lOyPCuJ1",
    label: "Manandriana",
    link: "kPG7EKqojrg",
  },
  {
    value: "hBOXdumAvNc",
    label: "Mananjary",
  },
  {
    value: "JgNqlQqv7Ow",
    label: "Mandoto",
  },
  {
    value: "NWDDUN43rIT",
    label: "Mandritsara",
  },
  {
    value: "aFVBzL062Oa",
    label: "Manja",
  },
  {
    value: "vHRv6NgA70x",
    label: "Manjakandriana",
    link: "I9lEj4mALls",
  },
  {
    value: "qwzcYsSzL7k",
    label: "Maroantsetra",
    link: "l3DKJQGIOwr",
  },
  {
    value: "xgvRu8zZAZK",
    label: "Marolambo",
  },
  {
    value: "ffiVmdBUwzI",
    label: "Marovoay",
    link: "A8UMJuP8iI3",
  },
  {
    value: "WdUkOAkKNxt",
    label: "Miandrivazo",
  },
  {
    value: "fVILcBfPtmG",
    label: "Miarinarivo",
  },
  {
    value: "SHpae2JNUz8",
    label: "Midongy du Sud",
    link: "HLuIxUgou3Z",
  },
  {
    value: "y5O9MdBC5du",
    label: "Mitsinjo",
    link: "A8UMJuP8iI3",
  },
  {
    value: "miFbLxS4bQB",
    label: "Morafenobe",
  },
  {
    value: "CjWDQW1TaaX",
    label: "Moramanga",
  },
  {
    value: "O96zKW0a9C2",
    label: "Morombe",
    link: "EzHpSGmTzSB",
  },
  {
    value: "X78SUVw5cQ8",
    label: "Morondava",
  },
  {
    value: "P7ko8ftfjUy",
    label: "Nosy Be",
  },
  {
    value: "nHBFdVsWCMf",
    label: "Nosy Boraha (Sainte Marie)",
    link: "l3DKJQGIOwr",
  },
  {
    value: "xofSjjKe6rZ",
    label: "Nosy Varika",
  },
  {
    value: "eXRsUrahFbT",
    label: "Sakaraha",
    link: "EzHpSGmTzSB",
  },
  {
    value: "cPc7Dgw3YHo",
    label: "Sambava",
  },
  {
    value: "Cwv7EQtgmSn",
    label: "Soalala",
    link: "A8UMJuP8iI3",
  },
  {
    value: "el4l6r6VycB",
    label: "Soanierana Ivongo",
    link: "l3DKJQGIOwr",
  },
  {
    value: "UTYZHOyWq6x",
    label: "Soavinandriana",
  },
  {
    value: "KBe7h4EfJDf",
    label: "Taolagnaro",
    link: "PTqLWwjcAox",
  },
  {
    value: "LzSBYniSIQ2",
    label: "Toamasina I",
    link: "wR0PL2iap0s",
  },
  {
    value: "l4zGnETxk44",
    label: "Toamasina II",
    link: "wR0PL2iap0s",
  },
  {
    value: "ezliibN7aLp",
    label: "Toliara I",
    link: "EzHpSGmTzSB",
  },
  {
    value: "X0m0mCPk74k",
    label: "Toliara II",
    link: "EzHpSGmTzSB",
  },
  {
    value: "S4iu0HmPwrM",
    label: "Tsaratanana",
    link: "gHNBsfuG0Cz",
  },
  {
    value: "ikfdG2YVc0I",
    label: "Tsihombe",
    link: "M0U5qF1l1ew",
  },
  {
    value: "r1z7rdpJTw5",
    label: "Tsiroanomandidy",
    link: "jrFvjsPtJrT",
  },
  {
    value: "fZrx6O2DJOm",
    label: "Vangaindrano",
    link: "HLuIxUgou3Z",
  },
  {
    value: "g9fwkcoIrBQ",
    label: "Vatomandry",
    link: "wR0PL2iap0s",
  },
  {
    value: "ss89res2mrR",
    label: "Vavatenina",
    link: "l3DKJQGIOwr",
  },
  {
    value: "BU35owjfn8G",
    label: "Vohibato",
  },
  {
    value: "QJAdwGaADrX",
    label: "Vohibinany (Brickaville)",
    link: "wR0PL2iap0s",
  },
  {
    value: "Jwt8WvzERHG",
    label: "Vohimarina (Vohémar)",
  },
  {
    value: "NR01IPDeNon",
    label: "Vohipeno",
  },
  {
    value: "ep6iGEmEoAx",
    label: "Vondrozo",
    link: "HLuIxUgou3Z",
  },
];

export default Formulaire;
