"use client";

import React from "react";
import Link from "next/link";
import { FamilyProfile } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import {
  User,
  GraduationCap,
  MapPin,
  IndianRupee,
  Heart,
  AlertCircle,
  Edit3,
  Sparkles,
  Users
} from "lucide-react";

interface FamilyContextCardProps {
  profile: FamilyProfile;
  initialResistance: number;
  currentResistance: number;
}

export function FamilyContextCard({
  profile,
  initialResistance,
  currentResistance
}: FamilyContextCardProps) {
  const { language, t } = useLanguage();
  const isMarathi = language === "mr";

  const getConcernLabel = (c: string) => {
    switch (c) {
      case "income":
        return isMarathi ? "पगार आणि आर्थिक स्थैर्य" : "Income & Financial Security";
      case "social_status":
        return isMarathi ? "डिग्रीच्या तुलनेत सामाजिक दर्जा" : "Social Perception vs Degree";
      case "job_security":
        return isMarathi ? "स्थानिक नोकरीची हमी" : "Local Job Security";
      case "higher_education":
        return isMarathi ? "पुढील शिक्षणाची संधी" : "Higher Education & Degrees";
      case "safety":
        return isMarathi ? "कामाच्या ठिकाणची सुरक्षितता" : "Workplace Safety";
      default:
        return isMarathi ? "करिअरमधील प्रगती" : "Career Growth";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t("counselling.contextTitle")}
            </h3>
            <span className="text-[11px] text-slate-500">
              {profile.userType === "learner_parent"
                ? isMarathi ? "पालक + विद्यार्थी एकत्र" : "Learner + Parent Joint"
                : isMarathi ? "कौटुंबिक प्रोफाइल" : "Family Profile"}
            </span>
          </div>
        </div>

        <Link
          href="/counselling"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/60"
        >
          <Edit3 className="w-3 h-3" />
          <span>{isMarathi ? "बदला" : "Edit"}</span>
        </Link>
      </div>

      {/* Context Details Grid */}
      <div className="space-y-2.5 text-xs text-slate-700">
        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="flex items-center gap-1.5 text-slate-500">
            <User className="w-3.5 h-3.5 text-slate-400" />
            {isMarathi ? "विद्यार्थी व वय" : "Learner"}
          </span>
          <span className="font-bold text-slate-900">
            {profile.learnerName || "Candidate"} ({profile.learnerAge || 19} yrs)
          </span>
        </div>

        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="flex items-center gap-1.5 text-slate-500">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
            {isMarathi ? "सध्याचे शिक्षण" : "Education"}
          </span>
          <span className="font-bold text-slate-900">
            {profile.education}
          </span>
        </div>

        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {isMarathi ? "स्थान / जिल्हा" : "Location"}
          </span>
          <span className="font-bold text-slate-900">
            {profile.locationDistrict}, {profile.locationState}
          </span>
        </div>

        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="flex items-center gap-1.5 text-slate-500">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
            {isMarathi ? "उत्पन्न गट" : "Income Bracket"}
          </span>
          <span className="font-bold text-slate-900">
            {profile.incomeBracket}
          </span>
        </div>

        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Heart className="w-3.5 h-3.5 text-slate-400" />
            {isMarathi ? "रस असलेले क्षेत्र" : "Field of Interest"}
          </span>
          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            {profile.primaryInterest}
          </span>
        </div>
      </div>

      {/* Main Family Dilemma Alert */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>{isMarathi ? "पालकांची मुख्य चिंता:" : "Primary Family Concern:"}</span>
        </div>
        <p className="text-xs font-medium pl-5">
          {getConcernLabel(profile.primaryConcern)}
        </p>
      </div>
    </div>
  );
}
