"use client";

import {
  AccountTreeOutlined,
  Dashboard,
  DifferenceOutlined,
  Houseboat,
  Inventory,
  KeyRounded,
  Logout,
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
import React, { useEffect } from "react";
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

const manageNavigations = [
  {
    label: "Dashboard",
    icon: <Dashboard />,
    path: "/manager",
  },
  {
    label: "Distribute Item",
    icon: <DifferenceOutlined />,
    path: "/distributions",
  },
];

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

  //
  useEffect(() => {
    console.log({ user });
  }, [user]);

  if (user && user.role === 1) {
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
          {/**Side bar header */}
          <div className="flex items-center justify-center gap-2 p-1">
            <Image
              src={ibs_logo}
              priority
              alt="ibs-logo"
              className="h-12 w-auto"
            />
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
          <Divider sx={{ borderTopColor: "#375ba5" }} />
          <List>
            {navigations.map((navi, index) => (
              <Link key={index} href={navi.path}>
                <ListItem
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
              </Link>
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
  }

  if (user && user.role === 2) {
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
          {/**Side bar header */}
          <div className="flex items-center justify-center gap-2 p-1">
            <Image
              src={ibs_logo}
              priority
              alt="ibs-logo"
              className="h-12 w-auto"
            />
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
          <Divider sx={{ borderTopColor: "#375ba5" }} />
          <List>
            {manageNavigations.map((navi, index) => (
              <Link key={index} href={navi.path}>
                <ListItem
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
              </Link>
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
  }
};

export default Sidebar;
