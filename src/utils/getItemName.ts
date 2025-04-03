import { UndistributedItem } from "@/types/global_types";

const getItemName = (itemDetails: UndistributedItem) => {
  return `${itemDetails?.ITEM_NAME ?? "--"}`;
};

export default getItemName;
