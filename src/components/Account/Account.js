import "./Account.css";
import React, { useState } from "react";
import { Card, Descriptions } from "antd";
import { PlusOutlined, MinusOutlined, SwapOutlined } from "@ant-design/icons";
import DepositWithdrawForm from "../Form/DepositWithdrawForm";
import TransferForm from "../Form/TransferForm";

const Account = ({
  name = "",
  balance = "",
  handleSubmitDeposit = () => {},
  handleSubmitWithdraw = () => {},
  handleSubmitTransfer = () => {},
  fee,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [isDeposit, setIsDeposit] = useState(true);

  const showModal = (deposit = false) => {
    setIsDeposit(deposit);

    setTimeout(() => {
      setIsModalVisible(true);
    }, 300);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const submitDeposit = (payload) => {
    const newPayload = {
      ...payload,
      onSuccessCb: () => {
        payload.onSuccessCb();
        handleCancel();
      },
      onFailedCb: () => {
        payload.onFailedCb();
        handleCancel();
      },
    };
    isDeposit
      ? handleSubmitDeposit(newPayload)
      : handleSubmitWithdraw(newPayload);
  };

  const showTransferModal = () => {
    setIsTransferModalVisible(true);
  };

  const handleCancelTransfer = () => {
    setIsTransferModalVisible(false);
  };

  const submitTransfer = (payload) => {
    const newPayload = {
      ...payload,
      onSuccessCb: () => {
        payload.onSuccessCb();
        handleCancelTransfer();
      },
      onFailedCb: () => {
        payload.onFailedCb();
        handleCancelTransfer();
      },
    };
    handleSubmitTransfer(newPayload);
  };

  return (
    <React.Fragment>
      <DepositWithdrawForm
        isDeposit={isDeposit}
        accountName={name}
        isModalVisible={isModalVisible}
        handleOk={submitDeposit}
        handleCancel={handleCancel}
        balance={balance}
      />

      <TransferForm
        fromAccountName={name}
        isModalVisible={isTransferModalVisible}
        handleOk={submitTransfer}
        handleCancel={handleCancelTransfer}
        fee={fee}
        balance={balance}
      />
      <Card
        title="Card"
        size="small"
        headStyle={{ display: "none" }}
        actions={[
          <span className="action" onClick={() => showModal(true)}>
            <PlusOutlined className="icon" />
            Deposit
          </span>,
          <span className="action" onClick={() => showModal()}>
            <MinusOutlined className="icon" />
            Withdraw
          </span>,
          <span className="action" onClick={showTransferModal}>
            <SwapOutlined className="icon transfer-icon" />
            Transfer
          </span>,
        ]}
      >
        <Descriptions title="" column={1}>
          <Descriptions.Item label="Account name">{name}</Descriptions.Item>
          <Descriptions.Item label="Balance">{balance} DAI</Descriptions.Item>
        </Descriptions>
      </Card>
    </React.Fragment>
  );
};

export default Account;
