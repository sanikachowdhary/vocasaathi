"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trade } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import {
  TrendingUp,
  Award,
  Clock,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Info,
  Building,
  GraduationCap
} from "lucide-react";

interface EvidenceCardProps {
  trade: Trade;
  isCompact?: boolean;
  onSelect?: (trade: Trade) => void;
}

export function EvidenceCard({ trade, isCompact = false, onSelect }: EvidenceCardProps) {
  const { language, t } = useLanguage();
  const [showFullDetails, setShowFullDetails] = useState(false);

  const isMarathi = language === "mr";
  const name = isMarathi ? trade.nameMr : trade.name;
  const sector = isMarathi ? trade.sectorMr : trade.sector;
  const safetyInfo = isMarathi ? trade.safetyInfoMr : trade.safetyInfo;
  const summary = isMarathi ? trade.summaryMr : trade.summary;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50 mb-1.5">
              {sector}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              {name}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <Award className="w-3.5 h-3.5" />
              NSQF {trade.nsqfLevel}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Core Quantitative Metrics Grid */}
      <div className="p-4 sm:p-5 grid grid-cols-2 gap-3 bg-white">
        {/* Metric 1: Placement */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("evidence.placementRate")}</span>
          </div>
          <p className="text-xl font-black text-emerald-700 mt-1">
            {trade.placementRate}%
          </p>
          <span className="text-[10px] text-slate-500">
            {isMarathi ? "स्थानिक नोंदणी" : "Regional avg"}
          </span>
        </div>

        {/* Metric 2: Median Starting Earnings */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-slate-600" />
            <span>{t("evidence.medianEarnings")}</span>
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">
            ₹{(trade.medianEarnings / 1000).toFixed(1)}k
          </p>
          <span className="text-[10px] text-slate-500">
            ₹{trade.earningsLow / 1000}k – ₹{trade.earningsHigh / 1000}k / mo
          </span>
        </div>

        {/* Metric 3: Course Duration */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>{t("evidence.duration")}</span>
          </div>
          <p className="text-xs font-bold text-slate-800 mt-1 truncate">
            {trade.duration}
          </p>
          <span className="text-[10px] text-slate-500">
            {trade.entryEducation}
          </span>
        </div>

        {/* Metric 4: Experienced Pay (3-5 Years) */}
        <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100/60">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("evidence.experiencedPay")}</span>
          </div>
          <p className="text-xs font-bold text-emerald-900 mt-1">
            {trade.experienceEarnings}
          </p>
        </div>
      </div>

      {/* Expanded Details Section */}
      {showFullDetails && (
        <div className="px-4 sm:px-5 pb-4 space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-3 bg-slate-50/30 animate-in fade-in duration-200">
          <div>
            <span className="font-bold text-slate-800 block mb-1">
              {isMarathi ? "उपलब्ध नोकऱ्यांचे प्रकार (Job Roles):" : "Key Job Roles:"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {trade.jobRoles.map((role, idx) => (
                <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-medium">
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-800 block mb-1">
              {isMarathi ? "पुढील शिक्षणाचे मार्ग (Higher Education):" : "Higher Education & Degrees:"}
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              {trade.higherEducationOptions.map((opt, idx) => (
                <li key={idx}>{opt}</li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/60 text-amber-900">
            <span className="font-bold block mb-0.5">
              {t("evidence.safety")}:
            </span>
            <p className="text-[11px] leading-relaxed">
              {safetyInfo}
            </p>
          </div>
        </div>
      )}

      {/* Footer & Disclaimer Badge */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="truncate">{t("app.illustrativeBadge")}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline focus:outline-none"
          >
            {showFullDetails ? (isMarathi ? "कमी करा" : "Less") : (isMarathi ? "तपशील पहा" : "Details")}
          </button>

          <Link
            href={`/compare?trade1=${trade.id}`}
            className="inline-flex items-center text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 px-2.5 py-1 rounded border border-slate-200 transition-colors"
          >
            {isMarathi ? "तुलना" : "Compare"}
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
