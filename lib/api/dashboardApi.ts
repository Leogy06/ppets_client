import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export interface RecentItem {
  ID: number;
  ITEM_NAME: string;
}

export interface DashboardData {
  recentItems: RecentItem[];
  activeUsers: number;
  employees: number;
  repairAsset: number;
  maintenanceAssets: number;
  assignedAssets: number;
  availableAssets: number;
  totalAssets: number;
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery,
  tagTypes: ["Dashboards"],
  endpoints: (builder) => ({
    dashboardData: builder.query<DashboardData, void>({
      query: () => "/api/dashboard",
      providesTags: ["Dashboards"],
    }),
  }),
});

export const { useDashboardDataQuery } = dashboardApi;
