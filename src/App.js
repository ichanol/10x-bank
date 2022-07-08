import "./App.css";
import React, { useState } from "react";
import { Space, Layout, Empty, Typography, Modal, Input, message } from "antd";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Account from "./components/Account/Account";
import Button from "./components/Button";
const { Title } = Typography;
const { Content } = Layout;

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    message.loading("Load...");
    setTimeout(() => {
      message.destroy();
      message.success("Yeah!", 2.5);
    }, 2500);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout className="layout">
      <Modal
        title="Create new account"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Create"
        closable={false}
        centered
      >
        <Input addonBefore="Account Name" />
      </Modal>
      <Header />
      <Content className="content">
        {!true ? (
          <Empty description="No Account" className="empty">
            <Button.Create onClick={showModal} />
          </Empty>
        ) : (
          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", maxWidth: 450, margin: "0 auto" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title level={5} style={{ textAlign: "center", margin: 0 }}>
                My accounts
              </Title>
              <Button.Create onClick={showModal} />
            </div>
            <Account />
          </Space>
        )}
      </Content>
      <Footer />
    </Layout>
  );
};

export default App;
