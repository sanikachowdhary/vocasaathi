"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DataProvider } from "@/lib/data/dataProvider";
import { Trade, FamilyProfile } from "@/lib/types";
import { SessionStorageManager } from "@/lib/storage";
import { useLanguage } from "@/lib/i18n/context";
import { TradeComparisonTable } from "@/components/compare/TradeComparisonTable";
import {
  GitCompare,
  Plus,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Layers
} from "lucide-react";

function CompareTradesContent() {
  const { language, t } = useLanguage();
  const isMarathi = language === "mr";
  const searchParams = useSearchParams();

  const allTrades = DataProvider.getAllTrades();
  const [profile, setProfile] = useState<FamilyProfile | undefined>();
  const [selectedTradeIds, setSelectedTradeIds] = useState<string[]>([
    "trade-electrician",
    "trade-solar-pv",
    "trade-cnc-machining",
  ]);

  useEffect(() => {
    const p = SessionStorageManager.getProfile();
    setProfile(p);

    const queryTrade1 = searchParams.get("trade1");
    if (queryTrade1 && allTrades.some((t) => t.id === queryTrade1)) {
      setSelectedTradeIds((prev) => Array.from(new Set([queryTrade1, ...prev])).slice(0, 3));
    }
  }, [searchParams, allTrades]);

  const handleAddTrade = (tradeId: string) => {
    if (!tradeId || selectedTradeIds.includes(tradeId)) return;
    if (selectedTradeIds.length >= 3) {
      // Replace last one if already 3
      setSelectedTradeIds([...selectedTradeIds.slice(0, 2), tradeId]);
    } else {
      setSelectedTradeIds([...selectedTradeIds, tradeId]);
    }
  };

  const handleRemoveTrade = (tradeId: string) => {
    setSelectedTradeIds(selectedTradeIds.filter((id) => id !== tradeId));
  };

  const selectedTrades = selectedTradeIds
    .map((id) => allTrades.find((t) => t.id === id))
    .filter((t): t is Trade => Boolean(t));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <GitCompare className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {isMarathi ? "तुलनात्मक विश्लेषण" : "Multi-Trade Parameter Evaluator"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t("compare.title")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t("compare.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t("app.illustrativeBadge")}
          </span>
        </div>
      </div>

      {/* Trade Selector Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            {t("compare.selectTrade")}:
          </label>
          <select
            onChange={(e) => {
              if (e.target.value) {
                handleAddTrade(e.target.value);
                e.target.value = "";
              }
            }}
            defaultValue=""
            className="px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold bg-white w-full sm:w-64"
          >
            <option value="" disabled>
              {isMarathi ? "+ कोर्स निवडा (कमाल ३)" : "+ Add trade to compare (Max 3)"}
            </option>
            {allTrades.map((t) => (
              <option
                key={t.id}
                value={t.id}
                disabled={selectedTradeIds.includes(t.id)}
              >
                {isMarathi ? t.nameMr : t.name} ({t.sector})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setSelectedTradeIds([])}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 self-end sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t("compare.clearAll")}</span>
        </button>
      </div>

      {/* Comparison Matrix Table Component */}
      <TradeComparisonTable
        selectedTrades={selectedTrades}
        profile={profile}
        onRemoveTrade={handleRemoveTrade}
      />
    </div>
  );
}

export default function CompareTradesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading comparison matrix...</div>}>
      <CompareTradesContent />
    </Suspense>
  );
}
