import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./spinner.css";
import LoadingSpinner from "./LoadingSpinner";
import Select from "react-select";
import MySkeleton from "./MySkeleton";

function Formulaire() 
{
  const [sortie, setSortie] = useState("enrollment");
  const [region, setRegion] = useState({ value: "MskGiUGbWJ8", label: "Alaotra Mangoro" , });
  const [orgUnit, setOrgUnit] = useState({ value: "lsCrRfgm2hS",label: "Ambatondrazaka",link: "MskGiUGbWJ8",});
  const [erreur, setErreur] = useState("doublon");
  const [periode, setPeriode] = useState("LAST_12_MONTHS");
  const [data, setData] = useState({ headers: { length: 0 } });
  const [loading, setLoading] = useState(false);
  const [dr, setDr] = useState("");
  const [nr, setNr] = useState("");
  const [dv, setDv] = useState("");
  const [nv, setNv] = useState("");

  const handleClick = () => {
    console.log("clicked");
    setData({ headers: { length: 0 } });
    setLoading(true);
    const url = "https://pmm-data-quality-teal.vercel.app/" + erreur + "-" + sortie;
    getData(url,"Nosybe","2021@Covax",periode,orgUnit.value,sortie + "s",sortie.toUpperCase(),sortie + "Date").then((data) => {
      getData("https://pmm-data-quality-teal.vercel.app/doublon-enrollment","Nosybe","2021@Covax",periode,orgUnit.value,"enrollments","enrollment".toUpperCase(),"enrollment" + "Date" ).then((data) => { setDr(data.data.length); });
      getData("https://pmm-data-quality-teal.vercel.app/NA-enrollment","Nosybe","2021@Covax",periode,orgUnit.value,"enrollments","enrollment".toUpperCase(),"enrollment" + "Date").then((data) => { setNr(data.data.length); });
      getData("https://pmm-data-quality-teal.vercel.app/doublon-event","Nosybe","2021@Covax",periode,orgUnit.value,"events","event".toUpperCase(),"event" + "Date").then((data) => { setDv(data.data.length); });
      getData("https://pmm-data-quality-teal.vercel.app/NA-event","Nosybe","2021@Covax",periode,orgUnit.value,"events","event".toUpperCase(),"event" + "Date").then((data) => { setNv(data.data.length); });
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

  const filteredOptions = options.filter((o) => o.link === region.value);

  return (
    <div className="container-fluid">
      <div className="row" style={{ height: "800px" }}>
        <div className="col-md-3  h-100">
          <div className="row px-5 my-4">
            <h4>Choisir ici</h4>
            <div className="form-group mb-3">
              <div className="form-label">Region</div>
              <Select options={optionsRegion} value={region} onChange={(selectedOption) => { setRegion(selectedOption);
              // setOrgUnit({ value: selectedOption.value, label: "Tous", link: selectedOption.value, }); 
            }} />
            </div>

            <div className="form-group mb-3">
              <div className="form-label">District</div>
              <Select options={filteredOptions} value={orgUnit} onChange={(selectedOption) => { setOrgUnit(selectedOption); }} />
            </div>

            <div className="form-group mb-3">
              <div className="form-label" htmlFor="disabledSelect">
                Type de sortie
              </div>
              <select className="form-select" value={sortie} onChange={(e) => {  setSortie(e.target.value); }} >
                <option value="enrollment">Enrollement</option>
                <option value="event">Evenement</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <div className="form-label" htmlFor="disabledSelect">
                Type d'Erreur a rectifier
              </div>
              <select
                className="form-select"
                value={erreur}
                onChange={(e) => {
                  setErreur(e.target.value);
                }}
              >
                <option value="doublon">Doublon</option>
                <option value="NA">Non-Appliquable</option>
              </select>
            </div>

            <div className="form-group mb-3">
              <div className="form-label">Choix de periode</div>
              <select
                className="form-select"
                id="disabledSelect"
                value={periode}
                onChange={(e) => {
                  setPeriode(e.target.value);
                }}
              >
                <option value="LAST_12_MONTHS">12 dernier mois</option>
                <option value="THIS_YEAR;LAST_5_YEARS">2021-2022</option>
                <option value="THIS_YEAR">cette année</option>
                <option value="LAST_5_YEARS">5 dernieres annees</option>
                <option value="LAST_YEAR">Année derniere</option>
              </select>
            </div>

            <button className="btn btn-dark" onClick={handleClick}>
              Consulter
            </button>
          </div>
          <div className="row">
            <div className="col-md-12 px-4">
              {loading ? (
                <LoadingSpinner />
              ) : (
                data.headers.length !== 0 && (
                  <table className="table table-dark table-striped">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Enrollement</th>
                        <th>Evenement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Doublons</td>
                        <td>{dr}</td>
                        <td>{dv}</td>
                      </tr>
                      <tr>
                        <td>NA</td>
                        <td>{nr}</td>
                        <td>{nv}</td>
                      </tr>
                    </tbody>
                  </table>
                )
              )}
            </div>
          </div>
        </div>
        <div className="col-md-9 h-100">
          <div className="row p-4">
            <div className="col-md-8">
              <h4>Resultat de recherche :</h4>
            </div>
            <div className="col-md-4">
              {data.headers.length !== 0 && (
                <button
                  icon="arrow-circle-down"
                  onClick={handleDownload}
                  className="btn btn-dark"
                >
                  Telecharger
                </button>
              )}
            </div>
          </div>
          <div className="row h-100">
            {data.headers.length !== 0 ? (
              <div className="w-100 p-3 overflow-auto h-75">
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      {data.headers.map((item, index) => {
                        return <th key={index}>{item}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((item, index) => {
                      return (
                        <tr key={index}>
                          {item.map((value, indice) => {
                            return <td key={indice}>{value}</td>;
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              loading && (
                <div className="w-100 p-3 overflow-auto h-75">
                  <MySkeleton size={5} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
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
    link: "kgGIXgdG56r",
  },
  {
    value: "Sc9CY4s8DWu",
    label: "Ambanja",
    link: "zJ9UJ7RhCwV",
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
    link: "OLNpyBROkUv",
  },
  {
    value: "MSvQtBZCz2k",
    label: "Ambatomainty",
    link: "wRAhGd81ae1",
  },
  {
    value: "lsCrRfgm2hS",
    label: "Ambatondrazaka",
    link: "MskGiUGbWJ8",
  },
  {
    value: "AdjFsUNV4Xg",
    label: "Ambilobe",
    link: "zJ9UJ7RhCwV",
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
    link: "kgGIXgdG56r",
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
    link: "HurBrymbN1S",
  },
  {
    value: "R4b2zHKwMWZ",
    label: "Andapa",
    link: "UYN92RXF3zu",
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
    link: "I9lEj4mALls",
  },
  {
    value: "JChr4ml1sQq",
    label: "Anosibe An'ala",
    link: "MskGiUGbWJ8",
  },
  {
    value: "GfT85pagjDs",
    label: "Antalaha",
    link: "UYN92RXF3zu",
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
    link: "OLNpyBROkUv",
  },
  {
    value: "qsoWFqtdF9j",
    label: "Antsalova",
    link: "wRAhGd81ae1",
  },
  {
    value: "jexxZljmEU6",
    label: "Antsirabe I",
    link: "OLNpyBROkUv",
  },
  {
    value: "WxDgNSFrAzU",
    label: "Antsirabe II",
    link: "OLNpyBROkUv",
  },
  {
    value: "StRGYBbsLRy",
    label: "Antsiranana I",
    link: "zJ9UJ7RhCwV",
  },
  {
    value: "s3HejcPkUeJ",
    label: "Antsiranana II",
    link: "zJ9UJ7RhCwV",
  },
  {
    value: "dMfFYzKMRmg",
    label: "Antsohihy",
    link: "HurBrymbN1S",
  },
  {
    value: "Ur9zMVj3DdJ",
    label: "Arivonimamo",
    link: "yyl4hZmgoC8",
  },
  {
    value: "l6uPphUTDyo",
    label: "Bealanana",
    link: "HurBrymbN1S",
  },
  {
    value: "mIvN6dmW7eP",
    label: "Befandriana Avaratra",
    link: "HurBrymbN1S",
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
    link: "YcjoRK39FIy",
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
    link: "wRAhGd81ae1",
  },
  {
    value: "yR491ce4ykk",
    label: "Betafo",
    link: "OLNpyBROkUv",
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
    link: "HurBrymbN1S",
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
    link: "OLNpyBROkUv",
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
    link: "kgGIXgdG56r",
  },
  {
    value: "qmBVgU1eL4R",
    label: "Iakora",
    link: "BwCu0NhYViZ",
  },
  {
    value: "VtP4BdCeXIo",
    label: "Ifanadiana",
    link: "O0yrAFTjghG",
  },
  {
    value: "mweNf27gPF9",
    label: "Ihosy",
    link: "BwCu0NhYViZ",
  },
  {
    value: "Y3c0TJ0yar4",
    label: "Ikalamavony",
    link: "kgGIXgdG56r",
  },
  {
    value: "NhHHkQTICLC",
    label: "Ikongo (Fort_Carnot)",
    link: "MH5KHIQYZfs",
  },
  {
    value: "X3Uq9Y4qqyd",
    label: "Isandra",
    link: "kgGIXgdG56r",
  },
  {
    value: "b6KVcdclMY1",
    label: "Ivohibe",
    link: "BwCu0NhYViZ",
  },
  {
    value: "jcFrOWmXoXI",
    label: "Kandreho",
    link: "gHNBsfuG0Cz",
  },
  {
    value: "QIBT6jU5eIi",
    label: "Lalangina",
    link: "kgGIXgdG56r",
  },
  {
    value: "SrAluezWP64",
    label: "Maevatanana",
    link: "gHNBsfuG0Cz",
  },
  {
    value: "AH15fnbv1S4",
    label: "Mahabo",
    link: "YcjoRK39FIy",
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
    link: "wRAhGd81ae1",
  },
  {
    value: "GTmHmMeVzaw",
    label: "Mampikony",
    link: "HurBrymbN1S",
  },
  {
    value: "fm9l2rMlGIV",
    label: "Manakara Atsimo",
    link: "MH5KHIQYZfs",
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
    link: "O0yrAFTjghG",
  },
  {
    value: "JgNqlQqv7Ow",
    label: "Mandoto",
    link: "OLNpyBROkUv",
  },
  {
    value: "NWDDUN43rIT",
    label: "Mandritsara",
    link: "HurBrymbN1S",
  },
  {
    value: "aFVBzL062Oa",
    label: "Manja",
    link: "YcjoRK39FIy",
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
    link : "wR0PL2iap0s"
  },
  {
    value: "ffiVmdBUwzI",
    label: "Marovoay",
    link: "A8UMJuP8iI3",
  },
  {
    value: "WdUkOAkKNxt",
    label: "Miandrivazo",
    link: "YcjoRK39FIy",
  },
  {
    value: "fVILcBfPtmG",
    label: "Miarinarivo",
    link: "yyl4hZmgoC8",
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
    link: "wRAhGd81ae1",
  },
  {
    value: "CjWDQW1TaaX",
    label: "Moramanga",
    link: "MskGiUGbWJ8",
  },
  {
    value: "O96zKW0a9C2",
    label: "Morombe",
    link: "EzHpSGmTzSB",
  },
  {
    value: "X78SUVw5cQ8",
    label: "Morondava",
    link: "YcjoRK39FIy",
  },
  {
    value: "P7ko8ftfjUy",
    label: "Nosy Be",
    link: "zJ9UJ7RhCwV",
  },
  {
    value: "nHBFdVsWCMf",
    label: "Nosy Boraha (Sainte Marie)",
    link: "l3DKJQGIOwr",
  },
  {
    value: "xofSjjKe6rZ",
    label: "Nosy Varika",
    link: "O0yrAFTjghG",
  },
  {
    value: "eXRsUrahFbT",
    label: "Sakaraha",
    link: "EzHpSGmTzSB",
  },
  {
    value: "cPc7Dgw3YHo",
    label: "Sambava",
    link: "UYN92RXF3zu",
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
    link: "yyl4hZmgoC8",
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
    link: "kgGIXgdG56r",
  },
  {
    value: "QJAdwGaADrX",
    label: "Vohibinany (Brickaville)",
    link: "wR0PL2iap0s",
  },
  {
    value: "Jwt8WvzERHG",
    label: "Vohimarina (Vohémar)",
    link: "UYN92RXF3zu",
  },
  {
    value: "NR01IPDeNon",
    label: "Vohipeno",
    link: "MH5KHIQYZfs",
  },
  {
    value: "ep6iGEmEoAx",
    label: "Vondrozo",
    link: "HLuIxUgou3Z",
  },
];

export default Formulaire;
