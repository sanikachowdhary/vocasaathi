"use client";

import React, { useState } from "react";
import { DistrictBenchmark } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import {
  MapPin,
  Flame,
  TrendingDown,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  Award
} from "lucide-react";

interface DistrictHeatmapProps {
  districts: DistrictBenchmark[];
}

export function DistrictHeatmap({ districts }: DistrictHeatmapProps) {
  const { language } = useLanguage();
  const isMarathi = language === "mr";

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictBenchmark>(districts[0]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-50 text-red-700">
              <Flame className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              {isMarathi ? "महाराष्ट्रात पालकांची सर्वाधिक चिंता कोठे आहे?" : "Parental Resistance & Concern Hotspots"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isMarathi ? "जिल्ह्यानुसार चिंता पातळी, मुख्य शंका आणि समुपदेशक कॉल्सची आकडेवारी पाहण्यासाठी खालील जिल्ह्यांवर क्लिक करा." : "Click any district to view top objections, affected trades, and escalation ratios."}
          </p>
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Illustrative Hackathon Analytics
        </span>
      </div>

      {/* Grid of District Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {districts.map((d) => {
          const isSelected = selectedDistrict.id === d.id;
          const districtName = isMarathi ? d.nameMr : d.name;

          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedDistrict(d)}
              className={`p-3.5 rounded-xl text-left transition-all border relative flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/40 scale-[1.02]"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-bold text-sm">
                  {districtName}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  d.hotspotIntensity === "High"
                    ? isSelected ? "bg-red-500/30 text-red-200" : "bg-red-100 text-red-800"
                    : isSelected ? "bg-amber-500/30 text-amber-200" : "bg-amber-100 text-amber-800"
                }`}>
                  {d.hotspotIntensity}
                </span>
              </div>

              <div>
                <span className={`text-[10px] block ${isSelected ? "text-slate-400" : "text-slate-500"}`}>
                  {isMarathi ? "सरासरी चिंता" : "Avg Resistance"}
                </span>
                <span className={`text-base font-black ${
                  isSelected ? "text-emerald-400" : "text-slate-900"
                }`}>
                  {d.avgInitialResistance} → {d.avgFinalResistance}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected District Drill-down Panel */}
      {selectedDistrict && (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-150">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isMarathi ? "निवडलेला जिल्हा" : "Inspected District"}
            </span>
            <h4 className="text-xl font-black text-slate-900 mt-0.5">
              {isMarathi ? selectedDistrict.nameMr : selectedDistrict.name}
            </h4>
            <span className="text-xs text-slate-600 mt-1 block">
              {selectedDistrict.totalSessions} Total Counselling Sessions
            </span>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block font-medium">
              {isMarathi ? "पालकांची मुख्य शंका" : "Primary Parental Objection"}
            </span>
            <p className="text-sm font-bold text-red-700 mt-0.5">
              {isMarathi ? selectedDistrict.topConcernLabelMr : selectedDistrict.topConcernLabel}
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block font-medium">
              {isMarathi ? "चिंता घट व समुपदेशक दर" : "Resistance Reduction & Calls"}
            </span>
            <p className="text-sm font-bold text-emerald-700 mt-0.5">
              -{selectedDistrict.avgResistanceReduction} pts avg | {selectedDistrict.escalationRate}% escalation
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-[11px] text-slate-500 block font-medium">
              {isMarathi ? "सर्वाधिक चर्चिले गेलेले कोर्सेस" : "Most Discussed Trades"}
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedDistrict.topTrades.map((t, idx) => (
                <span key={idx} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
