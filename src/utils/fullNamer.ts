import { Employee } from "@/types/global_types";

const fullNamer = (employeeDetails: Employee) => {
  if (!employeeDetails) return "--"; // this is for borrower, some notif has no need for borrower like distribution

  return `${employeeDetails.LASTNAME}, ${employeeDetails.FIRSTNAME} ${
    employeeDetails.MIDDLENAME ?? ""
  } ${employeeDetails.SUFFIX ?? ""}`.toUpperCase();
};
export default fullNamer;
