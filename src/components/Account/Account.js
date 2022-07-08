import "./Account.css";
import React from "react";
import { Card, Descriptions } from "antd";
import { PlusOutlined, MinusOutlined, SwapOutlined } from "@ant-design/icons";

const Account = () => {
  return (
    <Card
      title="Card"
      size="small"
      headStyle={{ display: "none" }}
      actions={[
        <span className="action">
          <PlusOutlined className="icon" />
          Deposit
        </span>,
        <span className="action">
          <MinusOutlined className="icon" />
          Withdraw
        </span>,
        <span className="action">
          <SwapOutlined className="icon transfer-icon" />
          Transfer
        </span>,
      ]}
    >
      <Descriptions title="" column={1}>
        <Descriptions.Item label="Account name">Some One</Descriptions.Item>
        <Descriptions.Item label="Balance">9999 ETH</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default Account;
