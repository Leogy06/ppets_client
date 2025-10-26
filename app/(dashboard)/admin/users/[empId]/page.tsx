"use client";

import { PageHeader } from "@/app/(components)/page-header";
import { useGetUserEmployeeQuery } from "@/lib/api/userApi";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmployeeUser = () => {
  const { empId } = useParams();

  const empIdNumber = empId ? Number(empId) : undefined;
  const { data: userData, isLoading: isUserLoading } = useGetUserEmployeeQuery(
    empIdNumber!,
    {
      skip: !empId, // skip if emp id is undefined
      refetchOnMountOrArgChange: true,
    }
  );

  const router = useRouter();

  return (
    <>
      <div className="flex gap-1 items-center">
        <Button onClick={() => router.back()} variant={"ghost"}>
          <ArrowLeft />
        </Button>
        <PageHeader text="User Profile" />
      </div>
      <div className="flex flex-col md:flex-row gap-y-3 justify-between">
        <div className="flex flex-col">
          <h3>{`${userData?.employee.FIRSTNAME ?? "--"} ${
            userData?.employee.MIDDLENAME ?? ""
          } ${userData?.employee.LASTNAME ?? "--"} ${
            userData?.employee.SUFFIX ?? ""
          }`}</h3>
          <p className="text-sm text-muted-foreground leading-tight tracking-tight">
            {userData?.userProfiles.length === 0
              ? "No active profiles"
              : userData?.userProfiles
                  .map((profile) => roleReader(profile.role))
                  .join("|")}
          </p>
        </div>
        <span>
          {userData?.userProfiles.map((profile) => (
            <div key={profile.id}>
              <Toggle pressed={profile.is_active === 1}>
                <div className="flex gap-1 items-center">
                  <Check /> Active
                </div>
              </Toggle>
              <Toggle pressed={profile.is_active === 0}>
                <div className="flex gap-1 items-center">
                  <X /> Inactive
                </div>
              </Toggle>
            </div>
          ))}
        </span>
      </div>
      <hr className="border" />
    </>
  );
};

export default EmployeeUser;

function roleReader(val: number) {
  switch (val) {
    case 1:
      return "Admin";
    case 2:
      return "Employee";

    default:
      return "Unknown role";
  }
}
