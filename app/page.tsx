"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { DataProvider } from "@/lib/data/dataProvider";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  MessageSquare,
  Compass,
  FileCheck2,
  Headphones,
  CheckCircle,
  HelpCircle,
  Volume2,
  Phone,
  BarChart3,
  Layers,
  Zap,
  Globe2
} from "lucide-react";

export default function LandingPage() {
  const { language, t } = useLanguage();
  const isMarathi = language === "mr";

  const featuredTrades = DataProvider.getAllTrades().slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white pt-12 sm:pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t("hero.badge")}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
              {t("hero.title")}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {t("hero.description")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/counselling"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 transition-all focus:ring-2 focus:ring-emerald-400"
              >
                <Users className="w-5 h-5" />
                <span>{t("hero.startCta")}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/explore/trades"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-base text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all"
              >
                <Compass className="w-5 h-5 text-slate-400" />
                <span>{t("hero.exploreCta")}</span>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">{t("hero.stat1")}</p>
                <p className="text-xs text-slate-400 font-medium">{t("hero.stat1Sub")}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">{t("hero.stat2")}</p>
                <p className="text-xs text-slate-400 font-medium">{t("hero.stat2Sub")}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-400">{t("hero.stat3")}</p>
                <p className="text-xs text-slate-400 font-medium">{t("hero.stat3Sub")}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Communication Diagram */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/80 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isMarathi ? "व्होकासाथी संवाद प्रवाह" : "The VocaSaathi Bridge"}
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Family-First Architecture
                </span>
              </div>

              {/* Visual Workflow Steps */}
              <div className="space-y-3 text-xs">
                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{isMarathi ? "१. विद्यार्थी + पालक एकत्र" : "1. Learner + Parent Context"}</h4>
                    <p className="text-slate-400 text-[11px]">{isMarathi ? "विद्यार्थ्याची आवड आणि पालकांच्या शंका एकत्र नोंदवणे" : "Captures dual aspirations & financial hesitations"}</p>
                  </div>
                </div>

                <div className="flex justify-center -my-1">
                  <span className="text-slate-500 text-xs">↓</span>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold flex-shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{isMarathi ? "२. पुराव्यांवर आधारित संवाद" : "2. Evidence-Backed Conversation"}</h4>
                    <p className="text-slate-400 text-[11px]">{isMarathi ? "पगार, प्लेसमेंट आणि करिअर मार्गाचे खरे आकडे" : "AI mediates with localized salary & NSQF metrics"}</p>
                  </div>
                </div>

                <div className="flex justify-center -my-1">
                  <span className="text-slate-500 text-xs">↓</span>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{isMarathi ? "३. कुटुंबाचा आत्मविश्वास व निर्णय" : "3. Family Confidence & Decision"}</h4>
                    <p className="text-slate-400 text-[11px]">{isMarathi ? "शंका निवारण किंवा मानवी समुपदेशकाची मदत" : "Resistance reduction or seamless counsellor handoff"}</p>
                  </div>
                </div>
              </div>

              {/* Fast Track CTA */}
              <div className="pt-2">
                <Link
                  href="/counselling"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{t("hero.demoFamilyCta")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY FAMILIES HESITATE (6 CONCERNS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isMarathi ? "पालकांचे वास्तव" : "Parental Anxieties Addressed"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            {t("concerns.title")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            {t("concerns.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Income */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              ₹
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t("concerns.income.title")}
            </h3>
            <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
              "{t("concerns.income.question")}"
            </p>
            <p className="text-xs text-slate-500 pt-1">
              {isMarathi
                ? "व्होकासाथी सुरुवातीचा पगार आणि ३-५ वर्षांनंतरची कमाई प्रत्यक्ष आकडेवारीसह दाखवते."
                : "Provides verified starting medians & 3-5 year experienced income progression."}
            </p>
          </div>

          {/* Card 2: Job Security */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t("concerns.jobSecurity.title")}
            </h3>
            <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
              "{t("concerns.jobSecurity.question")}"
            </p>
            <p className="text-xs text-slate-500 pt-1">
              {isMarathi
                ? "स्थानिक एमआयडीसी आणि उद्योगांमधील थेट प्लेसमेंट दर दाखवते."
                : "Shows local industrial demand and district-level placement rates."}
            </p>
          </div>

          {/* Card 3: Social Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t("concerns.socialStatus.title")}
            </h3>
            <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
              "{t("concerns.socialStatus.question")}"
            </p>
            <p className="text-xs text-slate-500 pt-1">
              {isMarathi
                ? "पारंपरिक पदवीच्या तुलनेत वेळ, खर्च आणि स्वावलंबनाची योग्य तुलना मांडते."
                : "Objectively compares 3-year BA/BSc degrees vs vocational earning timelines."}
            </p>
          </div>

          {/* Card 4: Career Growth */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t("concerns.careerGrowth.title")}
            </h3>
            <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
              "{t("concerns.careerGrowth.question")}"
            </p>
            <p className="text-xs text-slate-500 pt-1">
              {isMarathi
                ? "सुपरवायझर, मॅनेजर आणि स्वतंत्र उद्योजक बनण्याचे टप्पे स्पष्ट करते."
                : "Visualizes the journey from junior technician to licensed contractor or manager."}
            </p>
          </div>

          {/* Card 5: Higher Education */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t("concerns.higherEducation.title")}
            </h3>
            <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
              "{t("concerns.higherEducation.question")}"
            </p>
            <p className="text-xs text-slate-500 pt-1">
              {isMarathi
                ? "थेट पॉलिटेक्निक दुसऱ्या वर्ष (Lateral Entry) आणि B.Voc पदवीचे मार्ग स्पष्ट करते."
                : "Explains direct second-year lateral Polytechnic entry and UGC-recognized B.Voc degrees."}
            </p>
          </div>

          {/* Card 6: Safety */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t("concerns.safety.title")}
            </h3>
            <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
              "{t("concerns.safety.question")}"
            </p>
            <p className="text-xs text-slate-500 pt-1">
              {isMarathi
                ? "आधुनिक कारखान्यांमधील सुरक्षा उपकरणे आणि महिलांसाठी अनुकूलता स्पष्ट करते."
                : "Highlights regulated safety standards, PPE training, and gender inclusivity."}
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHAT VOCASAATHI DOES (3 PILLARS) */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              {isMarathi ? "३ प्रमुख आधारस्तंभ" : "Our Structured Solution"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3">
              {t("pillars.title")}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              {t("pillars.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Understand */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {t("pillars.card1Title")}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t("pillars.card1Desc")}
              </p>
            </div>

            {/* Pillar 2: Explain */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {t("pillars.card2Title")}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t("pillars.card2Desc")}
              </p>
            </div>

            {/* Pillar 3: Connect */}
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {t("pillars.card3Title")}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t("pillars.card3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EVIDENCE NOT ASSUMPTIONS (FEATURED TRADES PREVIEW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {isMarathi ? "पुराव्यांवर आधारित करिअर डेटा" : "Evidence Repository"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              {isMarathi ? "अनुमानांऐवजी वस्तुनिष्ठ आकडेवारी" : "Evidence, Not Assumptions"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {isMarathi ? "प्रत्येक कोर्सचे वेतन, प्लेसमेंट आणि एनएसक्यूएफ मार्गदर्शक आकडेवारी." : "Empirical placement rates, starting salaries, and NSQF levels."}
            </p>
          </div>

          <Link
            href="/explore/trades"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>{isMarathi ? "सर्व १० कोर्सेस पहा" : "View All 10 Seeded Trades"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTrades.map((trade) => (
            <EvidenceCard key={trade.id} trade={trade} />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS (6 STEPS) */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {t("howItWorks.title")}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t("howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "01", title: t("howItWorks.step1"), desc: isMarathi ? "वय, शिक्षण, जिल्हा आणि उत्पन्नाची माहिती." : "Learner qualifications, district, and household income." },
              { num: "02", title: t("howItWorks.step2"), desc: isMarathi ? "पगार, नोकरी किंवा सामाजिक प्रतिष्ठेची चिंता." : "Income, job security, or higher degree questions." },
              { num: "03", title: t("howItWorks.step3"), desc: isMarathi ? "स्थानिक प्लेसमेंट दर आणि पगाराचे टप्पे पहा." : "Verified placement rates, medians, and nearby ITIs." },
              { num: "04", title: t("howItWorks.step4"), desc: isMarathi ? "३ कोर्सेसची किंवा डिग्रीशी थेट तुलना करा." : "Compare up to 3 trades side-by-side on 10 metrics." },
              { num: "05", title: t("howItWorks.step5"), desc: isMarathi ? "पालक आणि विद्यार्थ्यांमध्ये एकमत घडवून आणा." : "Build family alignment with low-literacy audio." },
              { num: "06", title: t("howItWorks.step6"), desc: isMarathi ? "गरज भासल्यास शासकीय समुपदेशकांशी बोला." : "Auto-ticket handoff with full session transcript." }
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-black text-emerald-700 font-mono block">
                  STEP {step.num}
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DESIGNED FOR EVERYONE & ACCESSIBILITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/20">
              <Globe2 className="w-3.5 h-3.5" />
              Inclusive Public Service Design
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              {isMarathi ? "प्रत्येक कुटुंबासाठी सोपे आणि सुलभ." : "Accessible for Rural & Semi-Urban Families."}
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {isMarathi
                ? "स्थानिक मराठी भाषा, मोठ्या अक्षरांची सोय, उत्तर ऐकण्यासाठी ऑडिओ स्पीकर (🔊 Listen) आणि सुलभ मोबाईल रचना."
                : "Featuring natural Marathi translation, large touch targets, browser SpeechSynthesis for low-literacy users, and full mobile optimization."}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-semibold">मराठी + English</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-semibold">🔊 Speech Audio</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-semibold">100% Reliable Offline</span>
              <span className="bg-white/10 px-3 py-1 rounded-lg text-xs font-semibold">Mobile First</span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/counselling"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-slate-900 bg-white hover:bg-emerald-50 shadow-2xl transition-all text-base focus:ring-2 focus:ring-white"
            >
              <Sparkles className="w-5 h-5 text-emerald-700" />
              <span>{t("hero.startCta")}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
