import React from "react";
import { CDBFooter, CDBFooterLink, CDBBox, CDBBtn, CDBIcon } from "cdbreact";

export const Footer = () => {
  return (
    <CDBFooter className="shadow">
      <CDBBox
        display="flex"
        flex="column"
        className="mx-auto py-5"
        style={{ width: "90%" }}
      >
        <small className="text-center mt-5">
          &copy; PMM Developper, 2022. All rights reserved.
        </small>
      </CDBBox>
    </CDBFooter>
  );
};
