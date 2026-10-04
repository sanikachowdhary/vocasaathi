"use client";

import React, { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { FamilyProfile, CounsellorCase, Trade } from "@/lib/types";
import { createCasePayload } from "@/lib/counselling/escalationEngine";
import { DataProvider } from "@/lib/data/dataProvider";
import {
  Headphones,
  X,
  CheckCircle2,
  Phone,
  Clock,
  Globe2,
  FileText,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FamilyProfile;
  initialResistance: number;
  currentResistance: number;
  evidenceShown: Trade[];
  detectedObjections: string[];
}

export function EscalationModal({
  isOpen,
  onClose,
  profile,
  initialResistance,
  currentResistance,
  evidenceShown,
  detectedObjections,
}: EscalationModalProps) {
  const { language, t } = useLanguage();
  const isMarathi = language === "mr";

  const [contactName, setContactName] = useState(profile.learnerName ? `${profile.learnerName}'s Parent` : "Parent");
  const [contactPhone, setContactPhone] = useState("+91 98");
  const [preferredTime, setPreferredTime] = useState("Evening (5:00 PM – 7:00 PM)");
  const [preferredLang, setPreferredLang] = useState<"en" | "mr">(language);
  const [mainConcernText, setMainConcernText] = useState(
    isMarathi
      ? "आयटीआय नंतर पदवीचे दरवाजे उघडे राहतील का आणि पुण्यात थेट नोकरीची हमी काय?"
      : "Will degree pathways stay open after vocational course and what is the starting job stability in Pune?"
  );

  const [createdCase, setCreatedCase] = useState<CounsellorCase | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tradeNames = evidenceShown.map((t) => t.name);
    const newCase = createCasePayload({
      sessionId: `sess-${Date.now()}`,
      profile,
      contactName,
      contactNumber: contactPhone,
      preferredTime,
      preferredLanguage: preferredLang,
      currentResistance,
      initialResistance,
      transcriptSummary: mainConcernText,
      detectedObjections: detectedObjections.length > 0 ? detectedObjections : ["Income & Career Growth"],
      evidenceShown: tradeNames.length > 0 ? tradeNames : ["Electrician & Industrial Wiring"],
      priority: currentResistance >= 60 ? "High" : "Normal",
    });

    DataProvider.addCase(newCase);
    setCreatedCase(newCase);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {t("escalation.modalTitle")}
              </h3>
              <p className="text-xs text-slate-300">
                {t("escalation.modalSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5">
          {createdCase ? (
            /* Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  {t("escalation.successTitle")}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {t("escalation.summaryMsg")}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">
                    {t("escalation.caseId")}:
                  </span>
                  <span className="text-sm font-black font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    {createdCase.id}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Contact Person:</span>
                  <span className="font-bold text-slate-800">{createdCase.contactNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">District:</span>
                  <span className="font-bold text-slate-800">{createdCase.district}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Resistance Trajectory:</span>
                  <span className="font-bold text-amber-700">
                    {initialResistance} → {currentResistance} (Moderate)
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {t("escalation.close")}
                </button>
                <a
                  href="/counsellor"
                  className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-emerald-700 text-white hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1"
                >
                  <span>{isMarathi ? "समुपदेशक डॅशबोर्ड पहा" : "View Counsellor Portal"}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Context Summary Tag */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl flex items-start gap-2 text-xs text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    {isMarathi ? "संभाषणाचा संदर्भ आपोआप जोडला जाईल:" : "Auto-attached Session Intelligence:"}
                  </span>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    {profile.learnerName} ({profile.education}, {profile.locationDistrict}) • Resistance: {initialResistance} → {currentResistance} pts
                  </p>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t("escalation.name")}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    placeholder="e.g. Ramesh Deshmukh"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t("escalation.phone")}
                    </label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      placeholder="+91 98234 11092"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t("escalation.language")}
                    </label>
                    <select
                      value={preferredLang}
                      onChange={(e) => setPreferredLang(e.target.value as "en" | "mr")}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
                    >
                      <option value="mr">मराठी (Marathi)</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t("escalation.time")}
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
                  >
                    <option value="Morning (10:00 AM – 12:00 PM)">Morning (10:00 AM – 12:00 PM)</option>
                    <option value="Afternoon (2:00 PM – 4:00 PM)">Afternoon (2:00 PM – 4:00 PM)</option>
                    <option value="Evening (5:00 PM – 7:00 PM)">Evening (5:00 PM – 7:00 PM)</option>
                    <option value="Weekend (Saturday/Sunday)">Weekend (Saturday/Sunday)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t("escalation.mainDilemma")}
                  </label>
                  <textarea
                    rows={2}
                    value={mainConcernText}
                    onChange={(e) => setMainConcernText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    placeholder="Specific questions for the counsellor..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-900/10 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Headphones className="w-4 h-4" />
                  {t("escalation.submit")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
