import { UndistributedItem } from "@/types/global_types";

const getItemName = (itemDetails: UndistributedItem | undefined) => {
  return `${itemDetails?.ITEM_NAME ?? "--"}`;
};

export default getItemName;
