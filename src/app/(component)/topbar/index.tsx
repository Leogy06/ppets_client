import { useAppSelector } from "@/app/redux";
import { useAuth } from "@/context/AuthContext";
import { setIsDarkMode, setIsSideBarCollapse } from "@/state";
import { DarkMode, LightMode, Menu } from "@mui/icons-material";
import React from "react";
import { useDispatch } from "react-redux";

const Topbar = () => {
  const dispatch = useDispatch();
  const { user, empDetails } = useAuth();
  //sidebar
  const isSidebarOpen = useAppSelector(
    (state) => state.global.isSideBarCollapse
  );

  //side bar
  const openSidebar = () => {
    dispatch(setIsSideBarCollapse(!isSidebarOpen));
  };

  //dark mode toggle

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  return user ? (
    <div className="flex items-center justify-between bg-gray-50 text-gray-900 shadow-lg p-4">
      {/*First segment */}
      <div className="flex gap-4">
        <button onClick={openSidebar}>
          <Menu />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleDarkMode}>
          {isDarkMode ? <DarkMode /> : <LightMode />}
        </button>
        <span className="hover:text-gray-500">{empDetails?.FIRSTNAME}</span>
      </div>
    </div>
  ) : null;
};

export default Topbar;
