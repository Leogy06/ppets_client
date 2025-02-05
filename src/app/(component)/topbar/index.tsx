import { useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSideBarCollapse } from "@/state";
import { DarkMode, LightMode, Menu, Settings } from "@mui/icons-material";
import React from "react";
import { useDispatch } from "react-redux";

const Topbar = () => {
  const dispatch = useDispatch();

  //side bar
  const openSidebar = () => {
    dispatch(setIsSideBarCollapse(true));
  };

  //dark mode toggle

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  return (
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
        <button className="hover:text-gray-500">
          <Settings />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
