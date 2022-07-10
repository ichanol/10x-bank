const amountValidator = (balance) => (_, value) => {
  const currentAmount = Number(value) || 0;
  if (currentAmount >= 0 && currentAmount <= Number(balance)) {
    return Promise.resolve();
  } else {
    return Promise.reject("Insufficient Balance");
  }
};

export { amountValidator };
