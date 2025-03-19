"use client";

import {
  AccountTreeOutlined,
  Autorenew,
  Dashboard,
  ExpandLess,
  ExpandMore,
  Inventory,
  ListAlt,
  Logout,
  MoveToInboxOutlined,
  PanToolAltSharp,
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
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSideBarCollapse } from "@/state";
import { useAuth } from "@/context/AuthContext";
import { getGreeting } from "@/utils/greeting";
import path from "path";

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
    label: "Requests",
    icon: <Autorenew />,
    path: "/admin/requests",
    subMenu: [
      { label: "All", path: "/admin/requests" },
      { label: "Transfer", path: "/admin/requests/transfer_item" },
    ],
  },
  {
    label: "Distributions",
    icon: <AccountTreeOutlined />,
    path: "/admin/distributions",
  },
];

//employee
const managerNavigations = [
  {
    label: "Items",
    icon: <PanToolAltSharp />,
    path: "/manager",
  },
  {
    label: "Request",
    icon: <Autorenew />,
    path: "/manager/request",
  },
  {
    label: "On Lend Items",
    icon: <ListAlt />,
    path: "/manager/on_lend",
  },
  {
    label: "Borrowed Items",
    icon: <MoveToInboxOutlined />,
    path: "/manager/borrowed_items",
  },
];

//employee navigations
const employeeNavigations = [
  {
    label: "Borrowed Items",
    icon: <MoveToInboxOutlined />,
    path: "/employee",
  },
  {
    label: "Request Item",
    icon: <Autorenew />,
    path: "/employee/request_item",
  },
];

const SideBarHeader = () => {
  const { empDetails } = useAuth();

  // useEffect(() => {
  //   if (empDetails) {
  //     console.log("Emp details ", empDetails);
  //   }
  // }, [empDetails]);

  return (
    /**Side bar header */
    <div className="flex flex-col items-center justify-center gap-2 p-8 text-sm">
      <p className="text-base font-semibold">
        {empDetails?.departmentDetails?.DEPARTMENT_NAME ?? ""}
      </p>
      <p className="flex flex-col gap-1 items-center">
        <span>{getGreeting()},</span>
        <span className="font-semibold">{empDetails?.FIRSTNAME}!</span>
      </p>
    </div>
  );
};

const Sidebar = () => {
  const { user, logoutUser } = useAuth();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector(
    (state) => state.global.isSideBarCollapse
  );

  const closeSidebar = () => {
    dispatch(setIsSideBarCollapse(false));
  };

  // Track open menus
  const [openMenus, setOpenMenus] = useState({});

  const userNavigations =
    user?.role === 1
      ? navigations
      : user?.role === 2
      ? managerNavigations
      : user?.role === 3
      ? employeeNavigations
      : [];

  const toggleSubMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  if (!user) {
    return null;
  }

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
            <div key={index}>
              <ListItem
                component={navi.subMenu ? "div" : Link}
                href={!navi.subMenu ? navi.path : undefined}
                className="flex gap-4 hover:bg-blue-300 cursor-pointer"
                onClick={
                  navi.subMenu ? () => toggleSubMenu(navi.label) : undefined
                }
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
                {navi.subMenu &&
                  (openMenus[navi.label] ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>

              {/* Sub-menu rendering */}
              {navi.subMenu && openMenus[navi.label] && (
                <List sx={{ pl: 4 }}>
                  {navi.subMenu.map((sub, subIndex) => (
                    <ListItem
                      key={subIndex}
                      component={Link}
                      href={sub.path}
                      className="flex gap-4 hover:bg-blue-200"
                      sx={(theme) => ({
                        backgroundColor:
                          pathname === sub.path ? "#375ba5" : "transparent",
                        color:
                          pathname === sub.path
                            ? "#fff"
                            : theme.palette.mode === "dark"
                            ? "#fff"
                            : "#000",
                      })}
                    >
                      <ListItemText primary={sub.label} />
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
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
