"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { ShieldCheck, Heart, Sparkles, ExternalLink, HelpCircle, Compass, BarChart3, Users } from "lucide-react";

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                VS
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                VocaSaathi
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t("app.subtitle")}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {t("app.illustrativeBadge")}
              </span>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {language === "mr" ? "नेव्हिगेशन" : "Explore Platform"}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/counselling" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  {t("nav.counselling")}
                </Link>
              </li>
              <li>
                <Link href="/explore/trades" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-slate-500" />
                  {t("nav.exploreTrades")}
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  {t("nav.compare")}
                </Link>
              </li>
              <li>
                <Link href="/counsellor" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  {t("nav.counsellorPortal")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Public Service & Admin */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {language === "mr" ? "प्रशासन व धोरण" : "Administration & Policy"}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                  {t("nav.adminPortal")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/explore/providers" className="hover:text-emerald-400 transition-colors">
                  {language === "mr" ? "प्रशिक्षण संस्थांची यादी" : "Accredited Institutes"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Dataset Transparency & Mission */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {language === "mr" ? "माहिती पारदर्शकता" : "Data Transparency"}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              {t("app.disclaimer")}
            </p>
            <p className="text-[11px] text-slate-500">
              {language === "mr"
                ? "स्थानिक रोजगार, वेतन आणि एनएसक्यूएफ मार्गदर्शनासाठी तयार केलेले व्यासपीठ."
                : "Dedicated to family-first career confidence and transparent vocational outcomes."}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} VocaSaathi. {language === "mr" ? "कुटुंबांना कौशल्याची खात्री देणारा साथी." : "Helping families choose skills with confidence."}</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Evidence-First Vocational Guidance
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
