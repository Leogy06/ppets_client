import { DistributedItemProps } from "@/types/global_types";

//distributed item array mapper
export const mapDistributedItems = (items: DistributedItemProps[]) => {
  return items.map((item: DistributedItemProps, index: number) => {
    //destructure item details in items

    //destructure undistributed item
    const { ITEM_NAME, PAR_NO } = item.undistributedItemDetails;
    //destructure accountable employee
    const { FIRSTNAME, LASTNAME, MIDDLENAME, SUFFIX } =
      item.accountableEmpDetails;

    return {
      ...item,
      id: item.id,
      index,
      itemName: ITEM_NAME,
      itemPar: PAR_NO,
      quantity: item.quantity,
      accountableEmp: `${FIRSTNAME} ${MIDDLENAME ?? ""} ${LASTNAME} ${
        SUFFIX ?? ""
      }`,
    };
  });
};
