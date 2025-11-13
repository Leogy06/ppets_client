"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import FadeIn from "@/app/(components)/animations/FadeIn";
import {
  DashboardData,
  RecentItem,
  useDashboardDataQuery,
} from "@/lib/api/dashboardApi";

const pct = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 10000) / 100;

function StatCard({
  title,
  number,
  sub,
}: {
  title: string;
  number: number | string;
  sub?: string;
}) {
  return (
    <FadeIn>
      <motion.div whileHover={{ scale: 1.02, y: -2 }}>
        <Card className="p-4">
          <CardHeader className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500">{title}</div>
              <div className="text-2xl font-bold mt-1">{number}</div>
            </div>
            {sub && <Badge variant="secondary">{sub}</Badge>}
          </CardHeader>
        </Card>
      </motion.div>
    </FadeIn>
  );
}

function StatsGrid({ data }: { data: DashboardData }) {
  const utilization = pct(data.assignedAssets, data.totalAssets);
  const availablePct = pct(data.availableAssets, data.totalAssets);
  const maintenancePct = pct(data.maintenanceAssets, data.totalAssets);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        title="Total assets"
        number={data.totalAssets}
        sub={`${availablePct}% avail`}
      />
      <StatCard
        title="Assigned"
        number={data.assignedAssets}
        sub={`${utilization}% used`}
      />
      <StatCard
        title="Maintenance"
        number={data.maintenanceAssets}
        sub={`${maintenancePct}%`}
      />
      <StatCard
        title="Repair"
        number={data.repairAsset}
        sub={`${pct(data.repairAsset, data.totalAssets)}%`}
      />
    </div>
  );
}

function TinyTrend({ data }: { data: { name: string; value: number }[] }) {
  return (
    <FadeIn delay={0.5}>
      <Card className="p-3 h-40">
        <h3 className="text-sm font-medium mb-2">Usage trend (30d)</h3>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopOpacity={0.8}
                  stopColor="var(--primary)"
                />
                <stop offset="95%" stopOpacity={0} stopColor="var(--primary)" />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--primary-600)"
              fillOpacity={1}
              fill="url(#colorPrimary)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </FadeIn>
  );
}

function RecentItems({ items }: { items: RecentItem[] }) {
  return (
    <FadeIn delay={0.6}>
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Recent items</h3>
        <ul className="flex flex-col gap-2">
          {items.map((it) => (
            <li key={it.ID} className="flex items-center justify-between">
              <div className="text-sm">{it.ITEM_NAME}</div>
              <div className="text-xs text-gray-400">#{it.ID}</div>
            </li>
          ))}
        </ul>
      </Card>
    </FadeIn>
  );
}

function ItemsTable({ items }: { items: RecentItem[] }) {
  return (
    <FadeIn delay={0.7}>
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Assets list</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((it) => (
              <TableRow key={it.ID}>
                <TableCell>{it.ID}</TableCell>
                <TableCell>{it.ITEM_NAME}</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>
                  <button className="text-[var(--primary-700)] hover:underline">
                    View
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </FadeIn>
  );
}

export default function DashboardPage() {
  const { data: dashboardData, isLoading } = useDashboardDataQuery();

  const trendData = useMemo(() => {
    const base = 30;
    return Array.from({ length: 12 }).map((_, i) => ({
      name: `D${i + 1}`,
      value: Math.round(base + Math.sin(i / 2) * 10 + i * 2),
    }));
  }, []);

  if (isLoading || !dashboardData)
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-gray-500">Loading dashboard…</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-100)] to-[var(--bg-200)] text-gray-900 p-6">
      <StatsGrid data={dashboardData} />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <TinyTrend data={trendData} />
        <RecentItems items={dashboardData.recentItems} />
        <FadeIn delay={0.8}>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Quick stats</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                Total employees:{" "}
                <strong className="text-gray-800">
                  {dashboardData.employees}
                </strong>
              </li>
              <li>
                Active users: <strong>{dashboardData.activeUsers}</strong>
              </li>
              <li>
                Available / Total:{" "}
                <strong>
                  {dashboardData.availableAssets} / {dashboardData.totalAssets}{" "}
                  (
                  {pct(
                    dashboardData.availableAssets,
                    dashboardData.totalAssets
                  )}
                  %)
                </strong>
              </li>
              <li>
                Avg. downtime (est): <strong>3.2 days</strong>
              </li>
            </ul>
          </Card>
        </FadeIn>
      </div>
      <ItemsTable items={dashboardData.recentItems} />
    </div>
  );
}
