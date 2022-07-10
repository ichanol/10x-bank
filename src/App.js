import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { Space, Layout, Empty, Typography, message, Result } from "antd";
import { RocketTwoTone } from "@ant-design/icons";
import Web3 from "web3";

import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Account from "./components/Account/Account";
import Button from "./components/Button";
import NewAccountForm from "./components/Form/NewAccountForm";

import Bank from "./abis/Bank.json";
import DaiToken from "./abis/DaiToken.json";

const { Title } = Typography;
const { Content } = Layout;

const App = () => {
  const [currentAddress, setCurrentAddress] = useState(null);
  const [fee, setFee] = useState(1);
  const [myAccounts, setMyAccounts] = useState([]);
  const [isCreateAccountModalVisible, setIsCreateAccountModalVisible] =
    useState(false);

  const [bank, setBank] = useState(null);
  const [dai, setDai] = useState(null);

  const isEnableListener = useRef(true);

  const showCreateAccountModal = () => {
    setIsCreateAccountModalVisible(true);
  };

  const handleSubmitCreateAccount = async (
    accountName,
    successCb,
    failedCb
  ) => {
    message.loading("Creating new account");
    try {
      await bank.methods
        .createAccount(accountName)
        .send()
        .on("error", (error) => {
          failedCb();
          const errObj = JSON.parse(error.message.slice(49, -1));
          const errMsg = errObj.value.data.message.slice(50);
          message.error(errMsg, 4);
        })
        .on("transactionHash", (transactionHash) => {
          console.log("===>", { transactionHash });
          message.destroy();
          message.success("Account created!", 2.5);
          setTimeout(async () => {
            setIsCreateAccountModalVisible(false);
            successCb();
            await getMyAccounts(currentAddress);
          }, 2500);
        });
    } catch (error) {
      console.log("catch error => ", { error });
    }
  };

  const handleCancelCreateAccount = () => {
    setIsCreateAccountModalVisible(false);
  };

  const onConnectWallet = async () => {
    isEnableListener.current = false;
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      const [address] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      message.success("Wallet connected!", 2.5);
      setMyAccounts([]);
      setCurrentAddress(address);
      getMyAccounts(address);
      console.log("current address =====> ", address);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
  };

  const handleSubmitDeposit = async ({ data, onSuccessCb, onFailedCb }) => {
    message.loading("Deposit in progress");

    try {
      await dai.methods
        .approve(bank._address, Web3.utils.toWei(data.amount, "ether"))
        .send();

      await bank.methods
        .deposit(Web3.utils.toWei(data.amount, "ether"), data.accountName)
        .send()
        .on("error", (error) => {
          onFailedCb();
          const errObj = JSON.parse(error.message.slice(49, -1));
          const errMsg = errObj.value.data.message.slice(50);
          message.error(errMsg, 4);
        })
        .on("transactionHash", async (transactionHash) => {
          console.log("===>", { transactionHash });
          message.destroy();
          message.success("Deposit completed!", 2.5);
          setTimeout(async () => {
            onSuccessCb();
            await getMyAccounts(currentAddress);
          }, 2500);
        });
    } catch (error) {
      console.log("catch error => ", { error });
    }
  };

  const handleSubmitWithdraw = async ({ data, onSuccessCb, onFailedCb }) => {
    message.loading("Withdraw in progress");

    try {
      await bank.methods
        .withdraw(Web3.utils.toWei(data.amount, "ether"), data.accountName)
        .send()
        .on("error", (error) => {
          onFailedCb();
          const errObj = JSON.parse(error.message.slice(49, -1));
          const errMsg = errObj.value.data.message.slice(50);
          message.error(errMsg, 4);
        })
        .on("transactionHash", async (transactionHash) => {
          console.log("===>", { transactionHash });
          message.destroy();
          message.success("Withdraw completed!", 2.5);
          setTimeout(async () => {
            onSuccessCb();
            await getMyAccounts(currentAddress);
          }, 2500);
        });
    } catch (error) {
      console.log("catch error => ", { error });
    }
  };

  const handleSubmitTransfer = async ({ data, onSuccessCb, onFailedCb }) => {
    message.loading("Transfer in progress");
    console.log(data);

    try {
      await bank.methods
        .transfer(data.from, data.to, Web3.utils.toWei(data.amount, "ether"))
        .send()
        .on("error", (error) => {
          onFailedCb();
          const errObj = JSON.parse(error.message.slice(49, -1));
          const errMsg = errObj.value.data.message.slice(50);
          message.error(errMsg, 4);
        })
        .on("transactionHash", async (transactionHash) => {
          console.log("===>", { transactionHash });
          message.destroy();
          message.success("Transfer completed!", 2.5);
          setTimeout(async () => {
            onSuccessCb();
            await getMyAccounts(currentAddress);
          }, 2500);
        });
    } catch (error) {
      console.log("catch error => ", { error });
    }
  };

  const getMyAccounts = async (address) => {
    const networkId = await window.web3.eth.net.getId();
    const bankData = Bank.networks[networkId];

    if (bankData) {
      let bankContract;
      if (bank && address === currentAddress) {
        bankContract = bank;
      } else {
        bankContract = new web3.eth.Contract(Bank.abi, bankData.address, {
          from: address,
        });
        setBank(bankContract);
      }
      console.log({ bankContract });
      try {
        const result = await bankContract.methods.getMyAccounts().call();
        const transferFee = await bankContract.methods.fee().call();
        setMyAccounts(result);
        setFee(transferFee);
      } catch (error) {}
    } else {
      console.log("Bank contract not deployed on detected network");
    }
    //------------------------
    const daiTokenData = DaiToken.networks[networkId];

    if (daiTokenData) {
      let daiContract;
      if (dai && address === currentAddress) {
        daiContract = dai;
      } else {
        daiContract = new web3.eth.Contract(
          DaiToken.abi,
          daiTokenData.address,
          {
            from: address,
          }
        );
        setDai(daiContract);
      }
      console.log({ daiContract });
    } else {
      console.log("Dai contract not deployed on detected network");
    }
  };

  useEffect(() => {
    const onAccountChanged = async (accounts) => {
      if (
        isEnableListener.current &&
        accounts.length > 0 &&
        accounts[0] !== currentAddress
      ) {
        console.log("onAccountChanged");
        onConnectWallet();
      } else {
        setCurrentAddress(null);
      }
    };

    window.ethereum.on("accountsChanged", onAccountChanged);
    return () => {
      isEnableListener.current = true;
      window.ethereum.removeListener("accountsChanged", onAccountChanged);
    };
  }, [currentAddress]);

  const ContentComponent = () => {
    return Boolean(myAccounts.length === 0) ? (
      <Empty description="No Account" className="empty">
        <Button.Create onClick={showCreateAccountModal} />
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
          <Button.Create onClick={showCreateAccountModal} />
        </div>
        {myAccounts.map((item, i) => {
          return (
            <Account
              key={i}
              name={item.name}
              fee={fee}
              balance={Web3.utils.fromWei(item.balance, "ether")}
              handleSubmitDeposit={handleSubmitDeposit}
              handleSubmitWithdraw={handleSubmitWithdraw}
              handleSubmitTransfer={handleSubmitTransfer}
            />
          );
        })}
      </Space>
    );
  };

  return (
    <Layout className="layout">
      <NewAccountForm
        isModalVisible={isCreateAccountModalVisible}
        handleOk={handleSubmitCreateAccount}
        handleCancel={handleCancelCreateAccount}
      />
      <Header onConnectWallet={onConnectWallet} address={currentAddress} />
      <Content className="content">
        {Boolean(currentAddress) ? (
          <ContentComponent />
        ) : (
          <Result
            className="welcome"
            icon={<RocketTwoTone />}
            title="Welcome, getting start by connect your wallet!"
          />
        )}
      </Content>
      <Footer />
    </Layout>
  );
};

export default App;
