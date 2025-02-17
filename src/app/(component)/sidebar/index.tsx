"use client";

import {
  AccountTreeOutlined,
  CategoryOutlined,
  Dashboard,
  DifferenceOutlined,
  History,
  Houseboat,
  Inventory,
  KeyRounded,
  Logout,
  MoveToInboxOutlined,
  People,
  PeopleAlt,
  PeopleAltOutlined,
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
import { useAuth } from "@/context/AuthContext";

//global sidebar
//navigations

//admin navigations
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
    path: "/admin/manager",
  },
  {
    label: "Department",
    icon: <Houseboat />,
    path: "/admin/department",
  },
  {
    label: "Distributions",
    icon: <AccountTreeOutlined />,
    path: "/admin/distributions",
  },
];

const managerNavigations = [
  {
    label: "Dashboard",
    icon: <Dashboard />,
    path: "/manager",
  },
  {
    label: "Distribute Item",
    icon: <DifferenceOutlined />,
    path: "/manager/lend_items",
  },
  {
    label: "Category Item",
    icon: <CategoryOutlined />,
    path: "/manager/item_category",
  },
];

const employeeNavigations = [
  {
    label: "Borrowing History",
    icon: <History />,
    path: "/employee",
  },
  {
    label: "Borrowed Items",
    icon: <MoveToInboxOutlined />,
    path: "/employee/borrowed_items",
  },
  {
    label: "Employees",
    icon: <PeopleAltOutlined />,
    path: "/employee/employees",
  },
];

const SideBarHeader = () => {
  return (
    /**Side bar header */
    <div className="flex items-center justify-center gap-2 p-1">
      <Image src={ibs_logo} priority alt="ibs-logo" className="h-12 w-auto" />
      <div className="flex flex-col items-center justify-center text-base ">
        <div className={`flex items-baseline text-inherit  ms-0`}>
          <h3 className="text-lg font-bold text-green-500">I</h3>nventory
        </div>{" "}
        <div className={`flex items-baseline text-inherit ms-6`}>
          <h3 className="text-lg font-bold text-blue-500">B</h3>orrowing
        </div>{" "}
        <div className={`flex items-baseline text-inherit  ms-12`}>
          <h3 className="text-lg font-bold text-yellow-500">S</h3>ystem
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { user, logoutUser } = useAuth();
  const pathname = usePathname();

  const dispatch = useAppDispatch();

  //sidebar
  const isSidebarOpen = useAppSelector(
    (state) => state.global.isSideBarCollapse
  );

  const closeSidebar = () => {
    dispatch(setIsSideBarCollapse(false));
  };

  if (!user) {
    return null;
  }

  const userNavigations =
    user.role === 1
      ? navigations
      : user.role === 2
      ? managerNavigations
      : user.role === 3
      ? employeeNavigations
      : [];

  //admin sidebar
  return (
    <Drawer open={isSidebarOpen} onClose={closeSidebar}>
      <Box
        sx={{
          width: 260,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SideBarHeader />
        <Divider sx={{ borderTopColor: "#375ba5" }} />
        <List>
          {userNavigations.map((navi, index) => (
            <ListItem
              key={index}
              component={Link}
              href={navi.path}
              className="flex gap-4 hover:bg-blue-300"
              sx={(theme) => ({
                backgroundColor:
                  pathname === navi.path ? "#375ba5" : "transparent",
                color:
                  pathname === navi.path
                    ? "#fff"
                    : theme.palette.mode === "dark"
                    ? "#fff"
                    : "#000",
              })}
            >
              {navi.icon}
              <ListItemText
                primary={navi.label}
                sx={(theme) => ({
                  color:
                    pathname === navi.path
                      ? "#fff"
                      : theme.palette.mode === "dark"
                      ? "#fff"
                      : "#000",
                })}
              />
            </ListItem>
          ))}
        </List>
        <div className="self-baseline mt-auto w-full">
          <Divider />
          <ListItem disablePadding>
            <button
              className="flex items-center gap-4 justify-center w-full hover:bg-blue-300 p-4 text-lg"
              onClick={logoutUser}
            >
              <Logout sx={{ color: "inherit" }} />
              Logout
            </button>
          </ListItem>
        </div>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
