import React from "react";
import { Layout } from "antd";
const { Footer: FooterComponent } = Layout;

const Footer = () => {
  return (
    <FooterComponent
      style={{
        textAlign: "center",
      }}
    >
      10X BANK (BLOCKCAMP) ©2022 Created by CHANATIP R.
    </FooterComponent>
  );
};

export default Footer;
