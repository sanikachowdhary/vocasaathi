"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";
import { getResistanceBand } from "@/lib/counselling/sentimentAnalyzer";
import { Activity, ArrowDown, ShieldAlert, CheckCircle2 } from "lucide-react";

interface ResistanceMeterProps {
  initialScore: number;
  currentScore: number;
}

export function ResistanceMeter({ initialScore, currentScore }: ResistanceMeterProps) {
  const { language } = useLanguage();
  const isMarathi = language === "mr";

  const bandInfo = getResistanceBand(currentScore);
  const delta = initialScore - currentScore;

  // Determine color theme based on current band
  const getColorClasses = (score: number) => {
    if (score <= 24) return { text: "text-emerald-700", bg: "bg-emerald-600", bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" };
    if (score <= 49) return { text: "text-amber-700", bg: "bg-amber-600", bar: "bg-amber-500", badge: "bg-amber-50 text-amber-800 border-amber-200" };
    if (score <= 74) return { text: "text-orange-700", bg: "bg-orange-600", bar: "bg-orange-500", badge: "bg-orange-50 text-orange-800 border-orange-200" };
    return { text: "text-red-700", bg: "bg-red-600", bar: "bg-red-500", badge: "bg-red-50 text-red-800 border-red-200" };
  };

  const colors = getColorClasses(currentScore);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isMarathi ? "पालकांच्या चिंतेची पातळी" : "Resistance Meter (0–100)"}
            </h3>
            <span className="text-[10px] text-slate-500">
              Demo counselling metric
            </span>
          </div>
        </div>

        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${colors.badge}`}>
          {isMarathi ? bandInfo.bandLabelMr : bandInfo.bandLabel}
        </span>
      </div>

      {/* Visual Shift: 72 -> Evidence -> 41 */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            {isMarathi ? "सुरुवातीची चिंता" : "Initial"}
          </span>
          <span className="text-lg font-black text-slate-600">
            {initialScore}/100
          </span>
        </div>

        <div className="flex flex-col items-center px-2">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mb-1 flex items-center gap-0.5">
            <ArrowDown className="w-3 h-3" />
            {delta > 0 ? `-${delta} pts` : "0 pts"}
          </span>
          <span className="text-[9px] text-slate-500 font-medium">
            {isMarathi ? "पुरावा पाहिला" : "Evidence"}
          </span>
        </div>

        <div className="text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-800 block">
            {isMarathi ? "सध्याची पातळी" : "Current"}
          </span>
          <span className={`text-2xl font-black ${colors.text}`}>
            {currentScore}/100
          </span>
        </div>
      </div>

      {/* Progress Bar with Bands */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
          <div
            className={`h-full ${colors.bar} transition-all duration-500 ease-out`}
            style={{ width: `${currentScore}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-medium px-0.5">
          <span>0 (Low)</span>
          <span>25 (Mod)</span>
          <span>50 (High)</span>
          <span>75 (Very High)</span>
          <span>100</span>
        </div>
      </div>

      <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100/80 leading-relaxed">
        {currentScore < initialScore ? (
          <span className="flex items-start gap-1 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            {isMarathi
              ? "वेतन आणि पदवीच्या पुराव्यांमुळे पालकांचा आत्मविश्वास वाढत आहे."
              : "Verified salary ladders & lateral entry paths have reduced family hesitation."}
          </span>
        ) : (
          <span>
            {isMarathi
              ? "कुटुंबाच्या मनातील शंका समजून घेऊन वस्तुनिष्ठ डेटा सादर केला जात आहे."
              : "Addressing core family concerns using empirical hackathon datasets."}
          </span>
        )}
      </p>
    </div>
  );
}
