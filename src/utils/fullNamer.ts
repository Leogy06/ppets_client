import { Employee } from "@/types/global_types";

const fullNamer = (employeeDetails: Employee) => {
  return `${employeeDetails.LASTNAME}, ${employeeDetails.FIRSTNAME} ${
    employeeDetails.MIDDLENAME ?? ""
  } ${employeeDetails.SUFFIX ?? ""}`.toUpperCase();
};
export default fullNamer;
