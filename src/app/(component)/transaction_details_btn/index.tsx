import React from "react";
import DefaultButton from "../buttonDefault";
import { ViewList } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { TransactionProps } from "@/types/global_types";

interface ITransactionDetailsButton {
  transactionId: TransactionProps["id"];
}

const TransactionDetailsButton: React.FC<ITransactionDetailsButton> = ({
  transactionId,
}) => {
  const router = useRouter();
  return (
    <DefaultButton
      onClick={() => router.push(`/admin/requests/${transactionId}`)}
      btnIcon={<ViewList />}
      title="View Details"
      placement="left"
    />
  );
};

export default TransactionDetailsButton;
