import { useAppSelector } from "@/app/redux";
import { useAuth } from "@/context/AuthContext";
import { setIsDarkMode, setIsSideBarCollapse } from "@/state";
import { DarkMode, LightMode, Menu, Notifications } from "@mui/icons-material";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import logo_img from "@/assets/images/adts.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetUnreadNotificationCountQuery } from "@/features/api/apiSlice";

const Topbar = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const router = useRouter();
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

  //get unread notification count
  const { data: unreadNotificationCount } = useGetUnreadNotificationCountQuery(
    Number(user?.emp_id)
  );

  //prefetch notification
  useEffect(() => {
    router.prefetch("/notification");
  }, [router]);

  return user ? (
    <div className="flex items-center justify-between bg-gray-50 text-gray-900 shadow-lg p-4">
      {/*First segment */}
      <div className="flex gap-4">
        <button onClick={openSidebar}>
          <Menu />
        </button>
        <div className="flex items-center gap-4">
          <Image src={logo_img} alt="adts-logo" className="h-10 w-auto" />
          <span className="hidden md:block text-base font-semibold">
            Asset Distribution and Tracking System
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 relative">
        <button onClick={toggleDarkMode} className="hover:text-gray-500">
          {isDarkMode ? <DarkMode /> : <LightMode />}
        </button>

        <button
          onClick={() => router.push("/notification")}
          className="relative"
        >
          <Notifications />
          {unreadNotificationCount !== undefined &&
            unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                {unreadNotificationCount}
              </span>
            )}
        </button>
      </div>
    </div>
  ) : null;
};

export default Topbar;
