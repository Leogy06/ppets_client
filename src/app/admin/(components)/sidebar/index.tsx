"use client";

import {
  Dashboard,
  Houseboat,
  Inventory,
  KeyRounded,
  People,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import ibs_logo from "@/assets/ibs_logo.png";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSideBarCollapse } from "@/state";

//navigations
const navigations = [
  {
    label: "Dashboard",
    icon: <Dashboard />,
    path: "/admin",
  },
  {
    label: "Employees",
    icon: <People />,
    path: "/admin/employee",
  },
  {
    label: "Inventory",
    icon: <Inventory />,
    path: "/admin/inventory",
  },
  {
    label: "Manager",
    icon: <KeyRounded />,
    path: "admin/manager",
  },
  {
    label: "Department",
    icon: <Houseboat />,
    path: "/admin/department",
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  const dispatch = useAppDispatch();

  //sidebar
  const isSidebarOpen = useAppSelector(
    (state) => state.global.isSideBarCollapse
  );

  const closeSidebar = () => {
    dispatch(setIsSideBarCollapse(false));
  };

  return (
    <Drawer open={isSidebarOpen} onClose={closeSidebar}>
      <Box sx={{ width: 260, height: "100%" }}>
        {/**Side bar header */}
        <div className="flex items-center justify-center gap-2 p-1">
          <Image src={ibs_logo} alt="ibs-logo" className="h-12 w-auto" />
          <div className="flex flex-col items-center justify-center text-base ">
            <div className="flex items-baseline text-green-500 ms-0">
              <h3 className="text-lg font-bold">I</h3>nventory
            </div>{" "}
            <div className="flex items-baseline text-blue-500 ms-6">
              <h3 className="text-lg font-bold">B</h3>orrowing
            </div>{" "}
            <div className="flex items-baseline text-yellow-500 ms-12">
              <h3 className="text-lg font-bold">S</h3>ystem
            </div>
          </div>
        </div>
        <Divider sx={{ borderTopColor: "#375ba5" }} />
        <List>
          {navigations.map((navi, index) => (
            <Link key={index} href={navi.path}>
              <ListItem
                className="flex gap-4"
                sx={{
                  backgroundColor: `${pathname === navi.path ? "#375ba5" : ""}`,
                  color: `${pathname === navi.path ? "#fff" : "#375ba5"}`,
                }}
              >
                {navi.icon}
                <ListItemText primary={navi.label} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
