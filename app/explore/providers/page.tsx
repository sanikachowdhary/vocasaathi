"use client";

import React, { useState } from "react";
import { DataProvider } from "@/lib/data/dataProvider";
import { useLanguage } from "@/lib/i18n/context";
import { ProviderCard } from "@/components/evidence/ProviderCard";
import {
  Building2,
  Search,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Filter
} from "lucide-react";

export default function ExploreProvidersPage() {
  const { language, t } = useLanguage();
  const isMarathi = language === "mr";

  const allProviders = DataProvider.getAllProviders();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedVerification, setSelectedVerification] = useState<string>("all");

  const districts = Array.from(new Set(allProviders.map((p) => p.district)));

  const filteredProviders = allProviders.filter((provider) => {
    if (selectedDistrict !== "all" && provider.district !== selectedDistrict) return false;
    if (selectedVerification !== "all" && provider.verificationStatus !== selectedVerification) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = provider.name.toLowerCase().includes(term) || provider.nameMr.includes(term);
      const matchesAddress = provider.address.toLowerCase().includes(term);
      if (!matchesName && !matchesAddress) return false;
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
              <Building2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {isMarathi ? "प्रमाणित संस्था निर्देशिका" : "Accredited Training Centers"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t("nav.providers")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {isMarathi
              ? "शासकीय आयटीआय, तंत्रनिकेतने आणि एनएसडीसी मान्यताप्राप्त संस्थांची संपर्क माहिती व प्लेसमेंट आकडेवारी."
              : "Locate verified Government ITIs, State Polytechnics, and NSDC training partners in Maharashtra."}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {t("app.illustrativeBadge")}
        </span>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isMarathi ? "संस्थेचे नाव किंवा ठिकाण शोधा..." : "Search institute name or address..."}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
          />
        </div>

        <div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium bg-white"
          >
            <option value="all">{isMarathi ? "सर्व जिल्हे (All Districts)" : "All Maharashtra Districts"}</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium bg-white"
          >
            <option value="all">{isMarathi ? "सर्व संस्था प्रकार (All Types)" : "All Institutional Types"}</option>
            <option value="Government ITI">Government ITI (शासकीय आयटीआय)</option>
            <option value="State Polytechnic">State Polytechnic (शासकीय तंत्रनिकेतन)</option>
            <option value="NSDC Partner">NSDC Partner Centre</option>
          </select>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredProviders.length} verified institutes</span>
          <span>Contact numbers verified with regional training boards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </div>
  );
}
