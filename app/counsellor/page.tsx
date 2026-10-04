"use client";

import React, { useState, useEffect } from "react";
import { DataProvider } from "@/lib/data/dataProvider";
import { CounsellorCase } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import {
  Headphones,
  Search,
  Filter,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  ShieldCheck,
  FileText,
  Save,
  User,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function CounsellorPortalPage() {
  const { language } = useLanguage();
  const isMarathi = language === "mr";

  const [cases, setCases] = useState<CounsellorCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<CounsellorCase | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [editStatus, setEditStatus] = useState<CounsellorCase["status"]>("New");
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    const all = DataProvider.getAllCases();
    setCases(all);
    if (all.length > 0) {
      setSelectedCase(all[0]);
      setEditNotes(all[0].notes || "");
      setEditStatus(all[0].status);
    }
  }, []);

  const handleSelectCase = (c: CounsellorCase) => {
    setSelectedCase(c);
    setEditNotes(c.notes || "");
    setEditStatus(c.status);
  };

  const handleSaveCaseChanges = () => {
    if (!selectedCase) return;
    const updated = DataProvider.updateCaseStatus(selectedCase.id, editStatus, editNotes);
    if (updated) {
      setSelectedCase({ ...updated });
      setCases(DataProvider.getAllCases());
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  const filteredCases = cases.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesId = c.id.toLowerCase().includes(term);
      const matchesName = c.familyName.toLowerCase().includes(term) || c.learnerName.toLowerCase().includes(term);
      const matchesDistrict = c.district.toLowerCase().includes(term);
      if (!matchesId && !matchesName && !matchesDistrict) return false;
    }
    return true;
  });

  const getPriorityBadge = (p: string) => {
    if (p === "Urgent") return "bg-red-100 text-red-800 border-red-200";
    if (p === "High") return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getStatusBadge = (s: string) => {
    if (s === "New") return "bg-blue-100 text-blue-800 border-blue-200";
    if (s === "In Review") return "bg-amber-100 text-amber-800 border-amber-200";
    if (s === "Contacted") return "bg-purple-100 text-purple-800 border-purple-200";
    return "bg-emerald-100 text-emerald-800 border-emerald-200";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Headphones className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {isMarathi ? "समुपदेशक कार्यप्रणाली कक्ष" : "Vocational Counsellor Workflow Dashboard"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isMarathi ? "कुटुंब समुपदेशन केस रांग (Case Queue)" : "Family Escalation Case Queue"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {isMarathi
              ? "एआय संभाषणातून आलेले सारांश, पालकांच्या शंका आणि पुराव्यांसह मानवी समुपदेशनासाठी तयार केसेस."
              : "Review AI session transcripts, detected objections, resistance reduction trajectories, and recommended discussion points."}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Illustrative Counsellor CRM
        </span>
      </div>

      {/* Main 2-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Case List (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search case ID, learner, or district..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto text-[11px] font-bold">
              {["all", "New", "In Review", "Contacted", "Resolved"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    statusFilter === st
                      ? "bg-slate-900 text-white font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st === "all" ? "All Statuses" : st}
                </button>
              ))}
            </div>
          </div>

          {/* List of Case Cards */}
          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredCases.map((c) => {
              const isSelected = selectedCase?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectCase(c)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-white border-emerald-600 ring-2 ring-emerald-600/20 shadow-md scale-[1.01]"
                      : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-black font-mono text-slate-900">
                      {c.id}
                    </span>
                    <div className="flex gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityBadge(c.priority)}`}>
                        {c.priority}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-1">
                    {c.familyName} ({c.learnerName})
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {c.district}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-800">
                      {c.preferredLanguage === "mr" ? "मराठी" : "English"}
                    </span>
                  </div>

                  {/* Resistance shift pill */}
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Resistance:</span>
                    <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {c.initialResistance} → {c.resistanceScore} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Deep Case Inspection (7 cols on lg) */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-black font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      {selectedCase.id}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${getPriorityBadge(selectedCase.priority)}`}>
                      {selectedCase.priority} Priority
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    {selectedCase.familyName}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedCase.contactNumber}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Family</span>
                  </a>
                </div>
              </div>

              {/* Family Context Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Learner</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedCase.learnerName} ({selectedCase.learnerAge} yrs)</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Education</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedCase.education}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedCase.district}, {selectedCase.state}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Preferred Time</span>
                  <p className="font-bold text-emerald-800 mt-0.5">{selectedCase.preferredContactTime}</p>
                </div>
              </div>

              {/* AI Conversation Summary */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  AI Session Transcript Summary:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                  {selectedCase.transcriptSummary}
                </p>
              </div>

              {/* Detected Objections & Evidence Attached */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-red-50/50 p-3.5 rounded-xl border border-red-200/60 space-y-1.5">
                  <span className="font-bold text-red-950 block">Detected Parental Objections:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {selectedCase.detectedObjections.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200/60 space-y-1.5">
                  <span className="font-bold text-emerald-950 block">Evidence Shown During Session:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {selectedCase.evidenceShown.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Discussion Talking Points */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/70 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>AI Recommended Counsellor Discussion Talking Points:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {selectedCase.recommendedActions.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-amber-200/50">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Counsellor Status & Notes Editor */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-700">Update Status:</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveCaseChanges}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Counsellor Notes</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Counsellor Interaction Notes & Next Call Plan:
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Enter notes from call with parent (e.g. explained stipend, scheduled campus visit)..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {saveToast && (
                  <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Counsellor case record and notes saved successfully!</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
              Select a case from the queue to review transcript and recommended talking points.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
