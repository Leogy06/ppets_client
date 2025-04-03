const transactionType = (type: number) => {
  switch (type) {
    case 1:
      return "Borrowing Item";
    case 2:
      return "Lending Item";
    case 3:
      return "Distribution Item";
    case 4:
      return "Transfer Item";

    case 5:
      return "Returning Item";
    default:
      return "";
  }
};

export default transactionType;
