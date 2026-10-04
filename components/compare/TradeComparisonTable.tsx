"use client";

import React from "react";
import Link from "next/link";
import { Trade, FamilyProfile } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import {
  TrendingUp,
  Award,
  Clock,
  Briefcase,
  Shield,
  GraduationCap,
  Sparkles,
  Check,
  X,
  Building,
  HelpCircle
} from "lucide-react";

interface TradeComparisonTableProps {
  selectedTrades: Trade[];
  profile?: FamilyProfile;
  onRemoveTrade?: (tradeId: string) => void;
}

export function TradeComparisonTable({
  selectedTrades,
  profile,
  onRemoveTrade,
}: TradeComparisonTableProps) {
  const { language, t } = useLanguage();
  const isMarathi = language === "mr";

  if (selectedTrades.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="font-semibold text-base text-slate-700">
          {isMarathi ? "कोणताही कोर्स निवडलेला नाही" : "No Trades Selected for Comparison"}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {isMarathi ? "तुलना करण्यासाठी वरून १ ते ३ कोर्सेस निवडा." : "Select up to 3 trades from the dropdown to compare metrics."}
        </p>
      </div>
    );
  }

  // Generates contextual fit insights based on learner profile
  const getLearnerFitInsight = (trade: Trade) => {
    if (!profile) return "General high-demand track.";
    const interest = profile.primaryInterest.toLowerCase();
    const tradeName = trade.name.toLowerCase();

    if (tradeName.includes("electrician") && interest.includes("electrical")) {
      return isMarathi
        ? "उत्कृष्ट निवड! १२वी नंतर २ वर्षांत स्वतंत्र इलेक्ट्रीशियन किंवा महावितरण कंत्राटदार बनण्याची खात्रीशीर वाट."
        : "Strong alignment with candidate's science/technical interest. 2-year route to electrical contracting or industrial maintenance.";
    }
    if (tradeName.includes("solar") && (interest.includes("solar") || interest.includes("tech") || interest.includes("electrical"))) {
      return isMarathi
        ? "सनराइज सेक्टर! पीएम सूर्यघर योजनेमुळे पुण्यात छतावरील सोलर प्रकल्पांची मोठी मागणी."
        : "Fast-track green energy sunrise sector with heavy rooftop subsidies in Maharashtra.";
    }
    if (tradeName.includes("cnc") && (interest.includes("tech") || interest.includes("manufacturing"))) {
      return isMarathi
        ? "चाकण आणि भोसरी एमआयडीसीमध्ये उच्च वेतनाची हमी असणारा ऑटोमोबाइल उद्योग."
        : "Direct fit for Pune auto-ancillary industrial corridor (Bhosari/Chakan). Rapid salary multipliers for programmers.";
    }
    return isMarathi
      ? "स्थिर रोजगार आणि सरकारी पदविकेसाठी थेट दुसऱ्या वर्षाच्या प्रवेशाची उत्तम संधी."
      : "Provides stable starting income with direct lateral entry options to Polytechnic Diplomas.";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 font-bold text-slate-700 w-1/4">
                {t("compare.parameter")}
              </th>
              {selectedTrades.map((trade) => (
                <th key={trade.id} className="p-4 font-bold text-slate-900 border-l border-slate-200 w-1/4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mb-1">
                        {isMarathi ? trade.sectorMr : trade.sector}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {isMarathi ? trade.nameMr : trade.name}
                      </h4>
                    </div>
                    {onRemoveTrade && (
                      <button
                        type="button"
                        onClick={() => onRemoveTrade(trade.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {/* 1. Placement Rate */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>{t("evidence.placementRate")}</span>
              </td>
              {selectedTrades.map((t) => (
                <td key={t.id} className="p-4 border-l border-slate-100">
                  <span className="text-base font-black text-emerald-700">{t.placementRate}%</span>
                  <span className="text-[10px] text-slate-500 block">Verified outcome average</span>
                </td>
              ))}
            </tr>

            {/* 2. Starting Median Earnings */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-600" />
                <span>{t("evidence.medianEarnings")}</span>
              </td>
              {selectedTrades.map((t) => (
                <td key={t.id} className="p-4 border-l border-slate-100 font-bold text-slate-900">
                  <span className="text-sm font-black text-slate-900">₹{(t.medianEarnings).toLocaleString('en-IN')}/mo</span>
                  <span className="text-[10px] text-slate-500 block">Range: ₹{t.earningsLow.toLocaleString('en-IN')} – ₹{t.earningsHigh.toLocaleString('en-IN')}</span>
                </td>
              ))}
            </tr>

            {/* 3. Experienced Earnings (3-5 Yrs) */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t("evidence.experiencedPay")}</span>
              </td>
              {selectedTrades.map((t) => (
                <td key={t.id} className="p-4 border-l border-slate-100 text-emerald-800 font-bold bg-emerald-50/20">
                  {t.experienceEarnings}
                </td>
              ))}
            </tr>

            {/* 4. NSQF Level */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{t("evidence.nsqfLevel")}</span>
              </td>
              {selectedTrades.map((t) => (
                <td key={t.id} className="p-4 border-l border-slate-100 font-bold">
                  Level {t.nsqfLevel} (Govt Aligned)
                </td>
              ))}
            </tr>

            {/* 5. Training Duration */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-600" />
                <span>{t("evidence.duration")}</span>
              </td>
              {selectedTrades.map((t) => (
                <td key={t.id} className="p-4 border-l border-slate-100 font-medium">
                  {t.duration}
                </td>
              ))}
            </tr>

            {/* 6. Entry Qualification */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">
                {t("evidence.entryReq")}
              </td>
              {selectedTrades.map((t) => (
                <td key={t.id} className="p-4 border-l border-slate-100 text-slate-600 font-medium">
                  {t.entryEducation}
                </td>
              ))}
            </tr>

            {/* 7. Key Job Roles */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50">
                {isMarathi ? "उपलब्ध नोकऱ्या" : "Target Job Roles"}
              </td>
              {selectedTrades.map((t) => (
                <td key={t.id} className="p-4 border-l border-slate-100">
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                    {t.jobRoles.slice(0, 3).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* 8. Higher Education / Lateral Entry */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>{isMarathi ? "पुढील शिक्षणाची सोय" : "Higher Education Degree Pathway"}</span>
              </td>
              {selectedTrades.map((t) => (
                <td key={t.id} className="p-4 border-l border-slate-100 text-[11px] text-slate-600">
                  {t.higherEducationOptions[0]}
                </td>
              ))}
            </tr>

            {/* 9. Workplace Safety Info */}
            <tr>
              <td className="p-4 font-bold text-slate-900 bg-slate-50/50 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>{t("evidence.safety")}</span>
              </td>
              {selectedTrades.map((t) => (
                <td key={t.id} className="p-4 border-l border-slate-100 text-[11px] text-slate-600">
                  {isMarathi ? t.safetyInfoMr : t.safetyInfo}
                </td>
              ))}
            </tr>

            {/* 10. Family Context Fit Analysis */}
            <tr className="bg-amber-50/50">
              <td className="p-4 font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t("compare.learnerFit")}</span>
              </td>
              {selectedTrades.map((t) => (
                <td key={t.id} className="p-4 border-l border-amber-200/60 text-xs font-medium text-amber-950 leading-relaxed">
                  {getLearnerFitInsight(t)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Dataset Label */}
      <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <span className="font-semibold">✓ {t("app.illustrativeBadge")}</span>
        <span>Comparison matrix generated from empirical trade parameters</span>
      </div>
    </div>
  );
}
