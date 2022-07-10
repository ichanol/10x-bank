import "./Header.css";
import React from "react";
import { Layout, Button, Typography, Tooltip } from "antd";
import { WalletOutlined, RocketFilled } from "@ant-design/icons";
const { Title } = Typography;
const { Header: HeaderComponent } = Layout;

const Header = ({ onConnectWallet = () => {}, address = null }) => {
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
        onClick={address ? null : onConnectWallet}
      >
        {address ? (
          <Tooltip
            title={<span style={{ fontSize: 12 }}>{address}</span>}
            color="#545476"
            placement="bottomRight"
          >
            <span style={{ fontWeight: "bold" }}>{`0x...${address.slice(
              address.length - 4
            )}`}</span>
          </Tooltip>
        ) : (
          "Connect Wallet"
        )}
      </Button>
    </HeaderComponent>
  );
};

export default Header;
