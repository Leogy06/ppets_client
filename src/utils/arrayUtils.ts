import { DistributedItemProps, UndistributedItem } from "@/types/global_types";

//distributed item array mapper
export const mapDistributedItems = (items: DistributedItemProps[]) => {
  return items.map((item: DistributedItemProps) => {
    //destructure item details in items

    //destructure undistributed item
    const { ITEM_NAME, PAR_NO } = item.undistributedItemDetails;
    //destructure accountable employee
    const { FIRSTNAME, LASTNAME, MIDDLENAME, SUFFIX } =
      item.accountableEmpDetails;

    return {
      id: item.id,
      itemName: ITEM_NAME,
      itemPar: PAR_NO,
      quantity: item.quantity,
      accountableEmp: `${FIRSTNAME} ${MIDDLENAME ?? ""} ${LASTNAME} ${
        SUFFIX ?? ""
      }`,
    };
  });
};
