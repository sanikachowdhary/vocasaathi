"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import {
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  Heart,
  TrendingUp,
  FileCheck2,
  Headphones,
  CheckCircle2,
  Globe2,
  ArrowRight
} from "lucide-react";

export default function AboutMissionPage() {
  const { language, t } = useLanguage();
  const isMarathi = language === "mr";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          Evidence-Backed Vocational Guidance
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {isMarathi ? "व्होकासाथीचे ध्येय व संकल्पना" : "About VocaSaathi"}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {isMarathi
            ? "बहुतांश करिअर मार्गदर्शक फक्त विद्यार्थ्यांशी बोलतात. व्होकासाथी संपूर्ण कुटुंबाशी संवाद साधते."
            : "Most career-guidance platforms talk exclusively to the learner. VocaSaathi talks to the family."}
        </p>
      </div>

      {/* Core Public Service Philosophy */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <span>{isMarathi ? "पालक का महत्त्वाचे आहेत?" : "Why the Family Dimension Matters"}</span>
        </h2>
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            In Indian households—particularly across tier-2, tier-3, and rural communities—career choices are not individual consumer transactions. They are collective family investments deeply tied to financial risk tolerance, parental anxiety, and social perception.
          </p>
          <p>
            When a 19-year-old expresses interest in becoming an Electrician, Solar Technician, or CNC Machinist, parental hesitation is natural: <em>"Will you earn enough?", "Is this respected compared to a regular degree?", "Can you ever study further?"</em>
          </p>
          <p>
            Generic career chatbots fail because they give abstract encouragement ("Follow your dreams") instead of providing empirical reassurance. VocaSaathi addresses this gap by anchoring the counselling conversation in verified local placement rates, median salary benchmarks, and NSQF progression ladders.
          </p>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">1</span>
          <h3 className="font-bold text-slate-900 text-base">Understand Context</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Captures dual aspirations: the learner's technical interests alongside the parents' financial and safety concerns.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
          <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center">2</span>
          <h3 className="font-bold text-slate-900 text-base">Evidence-First AI</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zero hallucination policy. Every salary and placement figure is tied directly to audited outcome records.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
          <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-black text-sm flex items-center justify-center">3</span>
          <h3 className="font-bold text-slate-900 text-base">Human Escalation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automatically detects when automated advice is insufficient, packaging transcripts for certified human counsellors.
          </p>
        </div>
      </div>

      {/* Ethical AI & Data Transparency */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-8 space-y-4 text-xs text-amber-950">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <span>Ethical AI, Data Privacy & Benchmark Transparency</span>
        </div>
        <p className="leading-relaxed">
          <strong>Illustrative Dataset:</strong> All quantitative placement figures, starting salaries, and provider completion rates represent an illustrative simulated benchmark dataset for skills evaluation. They do not claim to represent official Ministry of Skill Development and Entrepreneurship (MSDE) census records.
        </p>
        <p className="leading-relaxed">
          <strong>Privacy By Design:</strong> Only demographic information necessary for context matching (district, qualification, field of interest) is requested. No personal phone numbers or unencrypted identifiers are stored externally.
        </p>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold">
          Ready to experience evidence-backed family counselling?
        </h3>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Explore our 10 seeded vocational sectors or load our pre-configured Pune demo family with 1 click.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/counselling"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <span>Start Counselling</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
