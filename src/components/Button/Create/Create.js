import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Create = ({ onClick }) => {
  return (
    <Button type="primary" onClick={onClick}>
      <PlusOutlined />
      Create
    </Button>
  );
};

export default Create;
