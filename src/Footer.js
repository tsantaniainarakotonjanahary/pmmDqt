import React from "react";
import { CDBFooter, CDBFooterLink, CDBBox, CDBBtn, CDBIcon } from "cdbreact";
import {
  MDBFooter,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBBtn,
} from "mdb-react-ui-kit";

export const Footer = () => {
  return (
    <MDBFooter className="text-center" color="white" bgColor="dark">
      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        <p className="text-white"> © 2022 Copyright : PMM Developper</p>
      </div>
    </MDBFooter>
  );
};
