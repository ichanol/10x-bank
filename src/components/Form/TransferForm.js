import React, { useState } from "react";
import { Input, Form, Modal, Typography } from "antd";
import { amountValidator } from "../../utils";
const { Text } = Typography;

const TransferForm = ({
  fromAccountName,
  isModalVisible,
  handleOk,
  handleCancel,
  fee,
  balance,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const amount = Form.useWatch("amount", form);

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        setIsLoading(true);
        handleOk({
          data: {
            from: fromAccountName,
            to: values.accountName,
            amount: values.amount,
          },
          onSuccessCb: () => {
            setIsLoading(false);
            form.resetFields();
          },
          onFailedCb: () => {
            setIsLoading(false);
          },
        });
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
      title="Transfer"
      visible={isModalVisible}
      onOk={onSubmit}
      onCancel={onCancel}
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
        <Form.Item
          name="amount"
          rules={[
            {
              required: true,
              message: "Please input the amount!",
            },
            {
              message: "Insufficient Balance!",
              validator: amountValidator(balance),
            },
          ]}
        >
          <Input addonBefore="Amount" addonAfter={"DAI"} type="number" />
        </Form.Item>
      </Form>

      <br />
      <br />
      <div>
        <Text mark>{`Fee ${fee}% = ${
          (Number(amount) || 0) * (fee / 100)
        } DAI | Receive ${
          (Number(amount) || 0) - (Number(amount) || 0) * (fee / 100)
        } DAI`}</Text>
      </div>
      <div>
        <Text type="warning">No Fee if you transfer to your account</Text>
      </div>
    </Modal>
  );
};

export default TransferForm;
