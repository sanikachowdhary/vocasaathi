"use client";

import React, { useState, useEffect } from "react";
import { DataProvider } from "@/lib/data/dataProvider";
import { AdminAnalyticsMetrics } from "@/lib/types";
import { AdminOverview } from "@/components/dashboard/AdminOverview";

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AdminAnalyticsMetrics | null>(null);

  useEffect(() => {
    const data = DataProvider.getAdminAnalytics();
    setAnalytics(data);
  }, []);

  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading administrator analytics...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AdminOverview analytics={analytics} />
    </div>
  );
}
