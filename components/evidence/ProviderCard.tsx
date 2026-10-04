"use client";

import React from "react";
import { Provider } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/context";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  GraduationCap,
  Home,
  Award
} from "lucide-react";

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const { language } = useLanguage();
  const isMarathi = language === "mr";

  const name = isMarathi ? provider.nameMr : provider.name;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {provider.verificationStatus}
            </span>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {provider.district}
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 leading-snug mb-2">
          {name}
        </h3>

        <p className="text-xs text-slate-600 flex items-start gap-1.5 mb-4">
          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>{provider.address}</span>
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">
              {isMarathi ? "प्लेसमेंट दर" : "Placement Rate"}
            </span>
            <span className="text-lg font-black text-emerald-700">
              {provider.placementRate}%
            </span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block">
              {isMarathi ? "कोर्स पूर्णता दर" : "Completion Rate"}
            </span>
            <span className="text-lg font-black text-slate-800">
              {provider.completionRate}%
            </span>
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 mb-4">
          {provider.hostelAvailable && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200/60">
              <Home className="w-3 h-3" />
              {isMarathi ? "वसतिगृह उपलब्ध" : "Hostel Available"}
            </span>
          )}
          {provider.scholarshipAvailable && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200/60">
              <Award className="w-3 h-3" />
              {isMarathi ? "शासकीय शिष्यवृत्ती" : "Govt Scholarship"}
            </span>
          )}
        </div>
      </div>

      {/* Contact info footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <a
          href={`tel:${provider.contactPhone}`}
          className="flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
        >
          <Phone className="w-3.5 h-3.5" />
          {provider.contactPhone}
        </a>
        <a
          href={`mailto:${provider.contactEmail}`}
          className="text-slate-500 hover:text-slate-800"
          title={provider.contactEmail}
        >
          <Mail className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
