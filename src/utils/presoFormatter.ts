import { AccountItem } from "@/types/global_types";

export const pesoFormatter = (value: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(parseFloat(value.toString().replace(/,/g, "")));
};

//destructure account code
export const accountCodeTitle = (accountCodeDetails: AccountItem) => {
  return `${accountCodeDetails.ACCOUNT_CODE} - ${accountCodeDetails.ACCOUNT_TITLE}`;
};
