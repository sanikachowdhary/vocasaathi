"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { FamilyProfile, ObjectionCategory } from "@/lib/types";
import { SessionStorageManager, DEFAULT_DEMO_FAMILY } from "@/lib/storage";
import {
  Users,
  GraduationCap,
  Sparkles,
  MapPin,
  IndianRupee,
  Globe2,
  AlertCircle,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

export default function CounsellingOnboardingPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const isMarathi = language === "mr";

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<FamilyProfile>(DEFAULT_DEMO_FAMILY);
  const [isDemoLoaded, setIsDemoLoaded] = useState(false);

  const handleLoadDemoFamily = () => {
    setProfile(DEFAULT_DEMO_FAMILY);
    setLanguage("mr");
    SessionStorageManager.saveProfile(DEFAULT_DEMO_FAMILY);
    SessionStorageManager.saveResistance(72);
    setIsDemoLoaded(true);
  };

  const handleStartSession = () => {
    SessionStorageManager.saveProfile(profile);
    SessionStorageManager.saveResistance(72);
    router.push("/counselling/session");
  };

  const updateProfile = (fields: Partial<FamilyProfile>) => {
    setProfile((prev) => ({ ...prev, ...fields }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Top Banner: Load Demo Family Shortcut for SIH Judges */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 rounded-2xl border border-emerald-700/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            SIH Demo Fast-Track
          </span>
          <h2 className="text-base sm:text-lg font-black text-white">
            {isMarathi ? "पुणे १२वी उत्तीर्ण डेमो कुटुंब" : "Instant SIH Demo Family Setup"}
          </h2>
          <p className="text-xs text-slate-300">
            {isMarathi
              ? "रोहन (वय १९, १२वी उत्तीर्ण, पुणे, ₹२-५ लाख, इलेक्ट्रिकल आवड, पगाराची चिंता)"
              : "Rohan Deshmukh (19 yrs, 12th Pass, Pune, ₹2–5L, Electrical, Income objection)"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadDemoFamily}
          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md hover:scale-105 transition-all"
        >
          <Zap className="w-4 h-4 text-slate-950 fill-current" />
          <span>{t("onboarding.loadDemo")}</span>
        </button>
      </div>

      {isDemoLoaded && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center justify-between gap-3 text-xs text-emerald-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span className="font-semibold">{t("onboarding.demoLoadedAlert")}</span>
          </div>
          <button
            type="button"
            onClick={handleStartSession}
            className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1"
          >
            <span>{t("onboarding.startSession")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Multi-Step Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              Step {step} of 7
            </span>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
              {t("onboarding.title")}
            </h1>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <span
                key={s}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                  s === step
                    ? "bg-emerald-700 text-white font-bold"
                    : s < step
                    ? "bg-emerald-100 text-emerald-800 font-bold"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* STEP 1: Who is participating? */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-800">
              {t("onboarding.step1Title")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "learner_parent", label: isMarathi ? "पालक + विद्यार्थी एकत्र" : "Learner + Parent Joint", desc: isMarathi ? "कुटुंबाच्या चर्चेसाठी सर्वोत्तम" : "Best for family decision making" },
                { id: "parent", label: isMarathi ? "केवळ पालक" : "Parent Only", desc: isMarathi ? "पालकांच्या शंका आणि चिंता" : "Addressing parental anxieties" },
                { id: "learner", label: isMarathi ? "केवळ विद्यार्थी" : "Learner Only", desc: isMarathi ? "कौशल्यांची आवड व माहिती" : "Aspirations and skill courses" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateProfile({ userType: opt.id as any })}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    profile.userType === opt.id
                      ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 text-emerald-950 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <p className="font-bold text-sm">{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t("onboarding.nameLabel")}</label>
                <input
                  type="text"
                  value={profile.learnerName}
                  onChange={(e) => updateProfile({ learnerName: e.target.value })}
                  placeholder="e.g. Rohan Deshmukh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t("onboarding.ageLabel")}</label>
                <input
                  type="number"
                  value={profile.learnerAge}
                  onChange={(e) => updateProfile({ learnerAge: parseInt(e.target.value) || 19 })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Current Education */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-800">
              {t("onboarding.step2Title")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "10th Pass",
                "12th Pass (Science)",
                "12th Pass (Commerce)",
                "12th Pass (Arts)",
                "Diploma Completed",
                "Graduate / Other"
              ].map((edu) => (
                <button
                  key={edu}
                  type="button"
                  onClick={() => updateProfile({ education: edu })}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    profile.education === edu
                      ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 text-emerald-950 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="font-bold text-sm block">{edu}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Industry Sector Interests */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-800">
              {t("onboarding.step3Title")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "Electrical & Technology",
                "Solar & Green Energy",
                "Manufacturing & CNC",
                "Healthcare & Hospital",
                "Automotive & EV",
                "IT / Computer Support",
                "Retail & Logistics",
                "Beauty & Wellness",
                "Food Processing"
              ].map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => updateProfile({ primaryInterest: interest })}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    profile.primaryInterest === interest
                      ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 text-emerald-950 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm block">{interest}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Location */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-800">
              {t("onboarding.step4Title")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t("onboarding.stateLabel")}</label>
                <select
                  value={profile.locationState}
                  onChange={(e) => updateProfile({ locationState: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-white"
                >
                  <option value="Maharashtra">Maharashtra (महाराष्ट्र)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t("onboarding.districtLabel")}</label>
                <select
                  value={profile.locationDistrict}
                  onChange={(e) => updateProfile({ locationDistrict: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm font-medium bg-white"
                >
                  <option value="Pune">Pune (पुणे - Prominent Industrial Demo Hub)</option>
                  <option value="Nashik">Nashik (नाशिक)</option>
                  <option value="Nagpur">Nagpur (नागपूर)</option>
                  <option value="Satara">Satara (सातारा)</option>
                  <option value="Kolhapur">Kolhapur (कोल्हापूर)</option>
                  <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar (छत्रपती संभाजीनगर)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Household Income Bracket */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-800">
              {t("onboarding.step5Title")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Below ₹2 lakh",
                "₹2–5 lakh",
                "₹5–10 lakh",
                "Above ₹10 lakh",
                "Prefer not to say"
              ].map((bracket) => (
                <button
                  key={bracket}
                  type="button"
                  onClick={() => updateProfile({ incomeBracket: bracket })}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    profile.incomeBracket === bracket
                      ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 text-emerald-950 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="font-bold text-sm block">{bracket}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Preferred Language */}
        {step === 6 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-800">
              {t("onboarding.step6Title")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  updateProfile({ preferredLanguage: "mr" });
                  setLanguage("mr");
                }}
                className={`p-6 rounded-2xl text-left border transition-all ${
                  language === "mr"
                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 text-emerald-950 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="text-lg font-black block text-emerald-800">मराठी</span>
                <span className="text-xs text-slate-500 mt-1 block">स्थानिक मराठी भाषेत संभाषण करा</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateProfile({ preferredLanguage: "en" });
                  setLanguage("en");
                }}
                className={`p-6 rounded-2xl text-left border transition-all ${
                  language === "en"
                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 text-emerald-950 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="text-lg font-black block text-slate-900">English</span>
                <span className="text-xs text-slate-500 mt-1 block">Clear conversational English</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Primary Family Concern */}
        {step === 7 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-slate-800">
              {t("onboarding.step7Title")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "income", label: isMarathi ? "पगार आणि आर्थिक स्थैर्य" : "Income & Starting Salary" },
                { id: "job_security", label: isMarathi ? "स्थानिक नोकरीची हमी" : "Local Job Security & Placement" },
                { id: "social_status", label: isMarathi ? "डिग्रीच्या तुलनेत सामाजिक दर्जा" : "Social Perception vs Degree" },
                { id: "higher_education", label: isMarathi ? "पुढील शिक्षणाची संधी (Lateral Entry)" : "Higher Education & Degrees" },
                { id: "safety", label: isMarathi ? "कामाच्या ठिकाणची सुरक्षितता" : "Workplace Safety & Inclusivity" },
                { id: "career_growth", label: isMarathi ? "दीर्घकालीन करिअर प्रगती" : "Long-term Career Growth" },
              ].map((concern) => (
                <button
                  key={concern.id}
                  type="button"
                  onClick={() => updateProfile({ primaryConcern: concern.id as ObjectionCategory })}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    profile.primaryConcern === concern.id
                      ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 text-emerald-950 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="font-bold text-xs sm:text-sm block">{concern.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("onboarding.back")}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>{t("onboarding.next")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartSession}
              className="px-8 py-3 rounded-xl font-black text-sm text-white bg-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-900/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t("onboarding.startSession")}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
