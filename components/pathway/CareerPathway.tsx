"use client";

import React, { useState } from "react";
import { ProgressionStep, Trade } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import {
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Layers
} from "lucide-react";

interface CareerPathwayProps {
  trade: Trade;
}

export function CareerPathway({ trade }: CareerPathwayProps) {
  const { language } = useLanguage();
  const isMarathi = language === "mr";

  const [activeStep, setActiveStep] = useState<number>(1);
  const currentProgression = trade.progression;
  const activeProgressionStep = currentProgression.find((s) => s.stepNumber === activeStep) || currentProgression[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6">
      {/* Pathway Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {isMarathi ? "करिअर प्रगतीचा नकाशा (Career Progression Ladder)" : "NSQF Career Progression Pathway"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isMarathi
              ? "प्रत्येक टप्प्यावर पद, अपेक्षित पगार आणि कौशल्यांचा तपशील पाहण्यासाठी खालील टप्प्यांवर क्लिक करा."
              : "Click on each progressive level to inspect responsibilities, skills, and salary evolution."}
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <Award className="w-3.5 h-3.5" />
          <span>{isMarathi ? "NSQF मान्यताप्राप्त मार्ग" : "NSQF Aligned Matrix"}</span>
        </div>
      </div>

      {/* Interactive Progression Step Buttons (Timeline) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {currentProgression.map((step) => {
          const isSelected = step.stepNumber === activeStep;
          const roleTitle = isMarathi ? step.roleMr : step.role;

          return (
            <button
              key={step.stepNumber}
              type="button"
              onClick={() => setActiveStep(step.stepNumber)}
              className={`p-3.5 rounded-xl text-left transition-all border relative flex flex-col justify-between ${
                isSelected
                  ? "bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-600/30 scale-[1.02]"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isSelected ? "bg-white/20 text-emerald-100" : "bg-white text-slate-600 border border-slate-200"
                }`}>
                  {isMarathi ? `टप्पा ${step.stepNumber}` : `Level ${step.stepNumber}`}
                </span>
                <span className={`text-[10px] font-semibold ${isSelected ? "text-emerald-200" : "text-slate-500"}`}>
                  {step.experience}
                </span>
              </div>

              <div className="font-bold text-xs sm:text-sm line-clamp-2 leading-snug">
                {roleTitle}
              </div>

              <div className={`mt-2 pt-2 border-t text-[11px] font-black ${
                isSelected ? "border-white/20 text-emerald-200" : "border-slate-200 text-emerald-700"
              }`}>
                {step.expectedEarnings}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep-Dive Card */}
      {activeProgressionStep && (
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-xl p-5 border border-emerald-100 space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                {isMarathi ? `टप्पा ${activeProgressionStep.stepNumber} तपशील` : `Level ${activeProgressionStep.stepNumber} Responsibility`}
              </span>
              <h4 className="text-lg font-black text-slate-900 mt-0.5">
                {isMarathi ? activeProgressionStep.roleMr : activeProgressionStep.role}
              </h4>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  {isMarathi ? "मासिक उत्पन्न श्रेणी" : "Earnings Bracket"}
                </span>
                <span className="text-base font-black text-emerald-800">
                  {activeProgressionStep.expectedEarnings}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-700 leading-relaxed">
            {isMarathi ? activeProgressionStep.descriptionMr : activeProgressionStep.description}
          </p>

          {/* Skills Required */}
          <div>
            <span className="text-xs font-bold text-slate-800 block mb-2">
              {isMarathi ? "या टप्प्यासाठी आवश्यक कौशल्ये (Key Competencies):" : "Key Competencies & Technical Skills:"}
            </span>
            <div className="flex flex-wrap gap-2">
              {activeProgressionStep.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs font-semibold bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Higher Education Lateral Entry Pathways */}
      <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-4 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{isMarathi ? "पुढील शिक्षणाचे मान्यताप्राप्त मार्ग (Higher Degrees):" : "Direct Higher Education & Degree Opportunities:"}</span>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
          {trade.higherEducationOptions.map((opt, idx) => (
            <li key={idx} className="flex items-start gap-1.5 bg-white p-2 rounded-lg border border-amber-200/50">
              <ArrowRight className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="font-medium text-[11px]">{opt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
