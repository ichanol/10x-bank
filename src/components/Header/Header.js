import "./Header.css";
import React from "react";
import { Layout, Button, Typography } from "antd";
import { WalletOutlined, RocketFilled } from "@ant-design/icons";
const { Title } = Typography;
const { Header: HeaderComponent } = Layout;

const Header = () => {
  return (
    <HeaderComponent
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "center",
      }}
    >
      <Title
        level={3}
        style={{ color: "white", textAlign: "center", margin: 0 }}
      >
        <RocketFilled className="rocket" />
        10X Bank
      </Title>
      <Button
        type="primary"
        shape="round"
        size="large"
        icon={<WalletOutlined />}
      >
        Connect Wallet
      </Button>
    </HeaderComponent>
  );
};

export default Header;
