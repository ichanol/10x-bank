import React, { useState } from "react";
import { Input, Form, Modal } from "antd";
import { amountValidator } from "../../utils";

const DepositWithdrawForm = ({
  accountName,
  isModalVisible,
  handleOk,
  handleCancel,
  isDeposit,
  balance,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        setIsLoading(true);
        handleOk({
          data: { accountName, amount: values.amount },
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
      title={isDeposit ? "Deposit" : "Withdraw"}
      visible={isModalVisible}
      onOk={onSubmit}
      onCancel={onCancel}
      okText="Confirm"
      closable={false}
      maskClosable={false}
      confirmLoading={isLoading}
      cancelButtonProps={{ disabled: isLoading }}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        name="depositWithdrawForm"
        autoComplete="off"
      >
        <Form.Item
          name="amount"
          rules={[
            {
              required: true,
              message: "Please input the amount!",
            },
            isDeposit
              ? {}
              : {
                  message: "Insufficient Balance!",
                  validator: amountValidator(balance),
                },
          ]}
        >
          <Input addonBefore="Amount" addonAfter={"DAI"} type="number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DepositWithdrawForm;
