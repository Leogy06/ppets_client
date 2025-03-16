import { useAppSelector } from "@/app/redux";
import { useAuth } from "@/context/AuthContext";
import { setIsDarkMode, setIsSideBarCollapse } from "@/state";
import { DarkMode, LightMode, Menu, Notifications } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import logo_img from "@/assets/images/adts.png";
import Image from "next/image";
import {
  useEditNotificationMutation,
  useGetNotificationQuery,
} from "@/features/api/apiSlice";
import {
  NotificationProps,
  NotificationPropsOther,
} from "@/types/global_types";
import { Paper } from "@mui/material";
import { dateFormmater } from "@/utils/date_formmater";
import { socket } from "@/hooks/useSocket";
import { useRouter } from "next/navigation";

const NotificationCard = ({
  isOpen,
  isLoading,
  notifications,
  addNotifLimit,
  handleReadNotification,
}: {
  isOpen: boolean;
  isLoading: boolean;
  notifications: NotificationProps[];
  addNotifLimit: () => void;
  handleReadNotification: (param: number) => void;
}) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <Paper className="absolute flex flex-col h-96 overflow-auto w-80 md:w-96 bg-white rounded-lg p-4 -bottom-32 z-50 right-0 top-full  left-auto">
      {isLoading ? (
        <span className="animate-pulse ">Loading...</span>
      ) : (
        <ul className="flex flex-col gap-4">
          <h1 className="font-bold text-base mb-4">Notifications</h1>
          {notifications.length === 0 ? (
            <span className="text-center">Nothing to show</span>
          ) : (
            notifications.map((n) => (
              <li
                key={n.ID}
                className={`border-b-2 flex flex-col p-2 cursor-pointer`}
                onClick={() => router.push("/notification")}
              >
                <span className="mb-2 text-sm font-semibold">{n.MESSAGE}</span>
                <span className="text-xs font-light flex justify-between">
                  on {dateFormmater(n.createdAt)}
                  {n.READ === 0 && (
                    <button
                      className="hover:text-gray-500 text-sm"
                      onClick={() => handleReadNotification(n.ID)}
                    >
                      Mark as Read
                    </button>
                  )}
                </span>
              </li>
            ))
          )}
          {notifications.length > 0 && (
            <li className="mt-4 flex w-full items-center justify-center border-t-2 p-2">
              <button
                onClick={addNotifLimit}
                className="w-full hover:text-gray-500"
              >
                See more Notification
              </button>
            </li>
          )}
        </ul>
      )}
    </Paper>
  );
};

const Topbar = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
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

  //read notificaiton

  const [editNotification] = useEditNotificationMutation();

  //notification limit
  const [notificationLimit, setNotificationLimit] = useState(10);

  //get notification
  const {
    data: notifications,
    isLoading: isNtfLoadng,
    refetch,
  } = useGetNotificationQuery({
    empId: user?.emp_id,
    limit: notificationLimit,
  });
  //open notificaiton

  //is notification open
  const [isOpen, setIsOpen] = useState(false);

  //notifications
  const [realTimeNotification, setRealTimeNotification] = useState<
    NotificationProps[]
  >([]);

  //notification cout
  const [unreadCount, setUnreadCount] = useState(0);

  //get new notificaiton
  useEffect(() => {
    const handleNotification = (newNotification: NotificationPropsOther) => {
      const notificationData =
        newNotification.ownerNotification ||
        newNotification.adminNotification ||
        (newNotification as unknown as NotificationProps);

      setRealTimeNotification((prev) => {
        const updatedNotifications: NotificationProps[] = [
          notificationData,
          ...prev,
        ];

        return updatedNotifications;
      });
    };

    socket.on("send-notification", handleNotification);

    return () => {
      socket.off("send-notification", handleNotification);
    };
  }, []);

  //count the unread notification
  useEffect(() => {
    const allNotifications = [
      ...realTimeNotification,
      ...(notifications || []),
    ];

    const unread = allNotifications.filter((n) => n.READ === 0).length;

    setUnreadCount(unread);
  }, [notifications, realTimeNotification]);

  //refetch notification if limit change
  useEffect(() => {
    refetch();
  }, [notificationLimit, refetch]);

  //increase limit notification
  const handleAddNotifLimit = () => {
    setNotificationLimit((prevCount) => prevCount + 5);
  };

  //read notification
  const handleReadNotification = async (notifId: number) => {
    try {
      await editNotification({
        notifId,
        editEntries: {
          editEntries: {
            read: 1,
          },
        },
      }).unwrap();

      //update realtime notification
      setRealTimeNotification((prev) =>
        prev.map((n) => (n.ID === notifId ? { ...n, READ: 1 } : n))
      );
      refetch();
    } catch (error) {
      console.error("Failed to mark as read. ", error);
    }
  };

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
        <button onClick={toggleDarkMode} className=" hover:text-gray-500">
          {isDarkMode ? <DarkMode /> : <LightMode />}
        </button>
        <button
          onClick={() => setIsOpen((prevState) => !prevState)}
          className={` hover:text-gray-500 ${
            isOpen ? "text-gray-500" : ""
          } relative`}
        >
          <Notifications />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        <NotificationCard
          isOpen={isOpen}
          notifications={[
            ...(realTimeNotification || []),
            ...(notifications || []),
          ]}
          isLoading={isNtfLoadng}
          addNotifLimit={handleAddNotifLimit}
          handleReadNotification={handleReadNotification}
        />
      </div>
    </div>
  ) : null;
};

export default Topbar;
