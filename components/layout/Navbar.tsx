"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import {
  Compass,
  Users,
  Building2,
  GitCompare,
  Headphones,
  BarChart3,
  Globe2,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
  Info
} from "lucide-react";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/counselling/session", label: t("nav.counselling"), icon: Users },
    { href: "/explore/trades", label: t("nav.exploreTrades"), icon: Compass },
    { href: "/explore/providers", label: t("nav.providers"), icon: Building2 },
    { href: "/compare", label: t("nav.compare"), icon: GitCompare },
    { href: "/counsellor", label: t("nav.counsellorPortal"), icon: Headphones },
    { href: "/admin", label: t("nav.adminPortal"), icon: BarChart3 },
    { href: "/about", label: t("nav.about"), icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm transition-colors">
      {/* Top public service banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
              SIH 2026 Prototype
            </span>
            <span className="hidden sm:inline text-slate-300">
              {t("app.disclaimer")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
              <Sparkles className="w-3 h-3" />
              {t("app.demoMode")}
            </span>
            <span className="text-slate-400 hidden md:inline">|</span>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              100% Offline Capable
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <span className="text-xl">VS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  VocaSaathi
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  व्होकासाथी
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-none mt-0.5">
                {t("app.tagline")}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-700" : "text-slate-400"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Language Switcher & Start Button */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === "en"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                aria-label="Switch to English"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("mr")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  language === "mr"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                aria-label="मराठीमध्ये बदला"
              >
                मराठी
              </button>
            </div>

            {/* Primary Action Button */}
            <Link
              href="/counselling"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm shadow-emerald-900/10 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              {t("nav.startCounselling")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Language Switcher */}
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "mr" : "en")}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-slate-50 text-slate-800"
            >
              {language === "en" ? "मराठी" : "EN"}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              {t("hero.badge")}
            </span>
            <span className="text-xs font-semibold text-emerald-700">
              {t("app.demoMode")}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1 pt-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-emerald-700" : "text-slate-400"}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              href="/counselling"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-emerald-700 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              {t("nav.startCounselling")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
