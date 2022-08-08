import React from "react";
import * as XLSX from "xlsx";

function App() {
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

  const handleClick = () => {
    getData(
      "https://gentle-inlet-74830.herokuapp.com/doublon-enrollement",
      "Nosybe",
      "2021@Covax",
      "LAST_12_MONTHS",
      "A8UMJuP8iI3",
      "enrollments",
      "ENROLLMENT",
      "enrollmentDate"
    ).then((data) => {
      console.log(data.data);
      exportXLSX(data.data, "Doublon-enrollement", "dataQT");
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Go</button>
    </div>
  );
}

export default App;
