"use client";

import PageHeader from "@/app/(component)/pageheader";
import { Inventory2Outlined } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const InventoryLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
      <div className="flex gap-4">
        <PageHeader
          pageHead="Inventory"
          icon={Inventory2Outlined}
          onClick={() => router.push("/admin/inventory")}
        />
        {pathname === "/admin/inventory/add" && (
          <PageHeader pageHead="Currently: Adding an item" />
        )}
      </div>
      {children}
    </>
  );
};

export default InventoryLayout;
