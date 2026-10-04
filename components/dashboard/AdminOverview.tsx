"use client";

import React from "react";
import { AdminAnalyticsMetrics } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import { DistrictHeatmap } from "./DistrictHeatmap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";
import {
  Users,
  Activity,
  Flame,
  Headphones,
  TrendingDown,
  Globe2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface AdminOverviewProps {
  analytics: AdminAnalyticsMetrics;
}

const COLORS = ["#15803d", "#0284c7", "#f59e0b", "#ea580c", "#8b5cf6", "#ec4899"];

export function AdminOverview({ analytics }: AdminOverviewProps) {
  const { language, t } = useLanguage();
  const isMarathi = language === "mr";

  return (
    <div className="space-y-8">
      {/* Top Header & Public Service Title */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded border border-emerald-500/30">
                Scheme Administrator Analytics
              </span>
              <span className="text-xs text-slate-400">
                Live Data Simulation
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t("admin.title")}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {t("admin.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/80 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Calculated from {analytics.totalFamiliesCounselled} seeded sessions</span>
          </div>
        </div>

        {/* Top 6 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">
              {t("admin.kpiFamilies")}
            </span>
            <p className="text-xl font-black text-white mt-0.5">
              {analytics.totalFamiliesCounselled}
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
              ↑ 18% this month
            </span>
          </div>

          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">
              {t("admin.kpiActive")}
            </span>
            <p className="text-xl font-black text-white mt-0.5">
              {analytics.activeSessionsCount}
            </p>
            <span className="text-[10px] text-blue-400 font-semibold mt-0.5">
              Real-time active
            </span>
          </div>

          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">
              {t("admin.kpiHighResistance")}
            </span>
            <p className="text-xl font-black text-orange-400 mt-0.5">
              {analytics.highResistanceCasesCount}
            </p>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Score ≥ 60
            </span>
          </div>

          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">
              {t("admin.kpiEscalations")}
            </span>
            <p className="text-xl font-black text-amber-400 mt-0.5">
              {analytics.escalationsCount}
            </p>
            <span className="text-[10px] text-amber-400 font-semibold mt-0.5">
              Human handoffs
            </span>
          </div>

          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">
              {t("admin.kpiAvgReduction")}
            </span>
            <p className="text-xl font-black text-emerald-400 mt-0.5">
              -{analytics.avgResistanceReduction} pts
            </p>
            <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
              Avg post-evidence
            </span>
          </div>

          <div className="bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 font-medium block">
              {t("admin.kpiLanguages")}
            </span>
            <p className="text-xl font-black text-white mt-0.5">
              68%
            </p>
            <span className="text-[10px] text-slate-300 font-semibold mt-0.5">
              मराठी (Marathi)
            </span>
          </div>
        </div>
      </div>

      {/* Calculated Insight Highlights Cards */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-700" />
          <h3 className="text-base font-bold text-amber-950">
            {t("admin.insightsTitle")}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {analytics.calculatedInsights.slice(0, 3).map((insight, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl border border-amber-200/60 text-slate-800 flex items-start gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Heatmap / Regional Hotspot Section */}
      <DistrictHeatmap districts={analytics.districtHeatmap} />

      {/* Row of Primary Charts (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Resistance Before vs After */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t("admin.chart1Title")}
              </h3>
              <p className="text-xs text-slate-500">
                Distribution of family resistance bands before vs after evidence presentation
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.resistanceDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="before" name="Before Evidence (Initial)" fill="#ea580c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="After Evidence (Final)" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top Parental Objections */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t("admin.chart2Title")}
              </h3>
              <p className="text-xs text-slate-500">
                Share of primary objections detected in family counselling queries
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.topObjections}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  label={({ name, percentage }) => `${percentage}%`}
                >
                  {analytics.topObjections.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} Sessions (${props.payload.percentage}%)`, name]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row of Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: District Benchmarks */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t("admin.chart3Title")}
              </h3>
              <p className="text-xs text-slate-500">
                Initial Resistance vs Final Resistance across Maharashtra districts
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.districtHeatmap} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="avgInitialResistance" name="Initial Resistance" fill="#ea580c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgFinalResistance" name="Final Resistance" fill="#15803d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Trade Popularity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t("admin.chart4Title")}
              </h3>
              <p className="text-xs text-slate-500">
                Trade exploration frequency vs verified placement rate
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.tradeInterest.slice(0, 6)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="tradeName" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="views" name="Session Discussions" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placementRate" name="Placement Rate (%)" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
