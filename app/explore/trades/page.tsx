"use client";

import React, { useState } from "react";
import { DataProvider } from "@/lib/data/dataProvider";
import { Trade } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import { CareerPathway } from "@/components/pathway/CareerPathway";
import {
  Compass,
  Search,
  Filter,
  ShieldCheck,
  Layers,
  Sparkles,
  CheckCircle2,
  X
} from "lucide-react";

export default function ExploreTradesPage() {
  const { language, t } = useLanguage();
  const isMarathi = language === "mr";

  const allTrades = DataProvider.getAllTrades();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedNsqf, setSelectedNsqf] = useState<string>("all");
  const [activeTradeForPathway, setActiveTradeForPathway] = useState<Trade | null>(allTrades[0]);

  const sectors = Array.from(new Set(allTrades.map((t) => t.sector)));

  const filteredTrades = allTrades.filter((trade) => {
    if (selectedSector !== "all" && trade.sector !== selectedSector) return false;
    if (selectedNsqf !== "all" && trade.nsqfLevel.toString() !== selectedNsqf) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = trade.name.toLowerCase().includes(term) || trade.nameMr.includes(term);
      const matchesSector = trade.sector.toLowerCase().includes(term) || trade.sectorMr.includes(term);
      const matchesRoles = trade.jobRoles.some((r) => r.toLowerCase().includes(term));
      if (!matchesName && !matchesSector && !matchesRoles) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {isMarathi ? "व्यावसायिक अभ्यासक्रम निर्देशिका" : "Vocational Trade Catalog"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t("nav.exploreTrades")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {isMarathi
              ? "प्लेसमेंट दर, सुरुवातीचा पगार, कामाचे स्वरूप आणि पदवीच्या संधींसह १० प्रमाणित कोर्सेस."
              : "Explore empirical salary ranges, placement metrics, and NSQF ladders across 10 vocational sectors."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t("app.illustrativeBadge")}
          </span>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isMarathi ? "कोर्सचे नाव किंवा कौशल्य शोधा..." : "Search trade name, sector, or job role..."}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
          />
        </div>

        <div>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium bg-white"
          >
            <option value="all">{isMarathi ? "सर्व क्षेत्रे (All Sectors)" : "All Industry Sectors"}</option>
            {sectors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedNsqf}
            onChange={(e) => setSelectedNsqf(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium bg-white"
          >
            <option value="all">{isMarathi ? "सर्व NSQF स्तर (All Levels)" : "All NSQF Levels"}</option>
            <option value="3">NSQF Level 3 (Basic)</option>
            <option value="4">NSQF Level 4 (Standard ITI)</option>
            <option value="5">NSQF Level 5 (Specialist)</option>
          </select>
        </div>
      </div>

      {/* Featured Career Pathway Preview Drawer */}
      {activeTradeForPathway && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              {isMarathi ? "निवडलेल्या कोर्सचा करिअर नकाशा:" : "Interactive Pathway Viewer for:"}{" "}
              <strong className="text-emerald-800 font-bold">{isMarathi ? activeTradeForPathway.nameMr : activeTradeForPathway.name}</strong>
            </span>
          </div>
          <CareerPathway trade={activeTradeForPathway} />
        </div>
      )}

      {/* Grid of Trade Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredTrades.length} of {allTrades.length} trades</span>
          <span>Click "View Pathway" to inspect career steps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrades.map((trade) => (
            <div key={trade.id} className="flex flex-col justify-between">
              <EvidenceCard trade={trade} />
              <button
                type="button"
                onClick={() => {
                  setActiveTradeForPathway(trade);
                  window.scrollTo({ top: 220, behavior: "smooth" });
                }}
                className="mt-2 w-full py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center justify-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isMarathi ? "करिअर नकाशा वर पहा" : "Inspect Career Pathway"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
