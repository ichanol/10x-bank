import React, { useState } from "react";
import { Input, Form, Modal } from "antd";

const NewAccountForm = ({ isModalVisible, handleOk, handleCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        setIsLoading(true);
        handleOk(
          values.accountName,
          () => {
            setIsLoading(false);
            form.resetFields();
          },
          () => {
            setIsLoading(false);
          }
        );
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const onCancel = () => {
    handleCancel();
    form.resetFields();
  };

  return (
    <Modal
      title="Create new account"
      visible={isModalVisible}
      onOk={onSubmit}
      onCancel={onCancel}
      okText="Create"
      closable={false}
      maskClosable={false}
      confirmLoading={isLoading}
      cancelButtonProps={{ disabled: isLoading }}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        name="newAccountForm"
        autoComplete="off"
      >
        <Form.Item
          name="accountName"
          rules={[
            {
              required: true,
              message: "Please input the name!",
            },
          ]}
        >
          <Input addonBefore="Account Name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewAccountForm;
