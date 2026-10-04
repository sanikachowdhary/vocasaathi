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
  Menu,
  X,
  Sparkles,
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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl p-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">VS</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                  VocaSaathi
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  व्होकासाथी
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-500 leading-none mt-0.5">
                {t("app.tagline")}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-emerald-700" : "text-slate-400"
                    }`}
                  />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Language Switcher & Start Button */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  language === "en"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                aria-label="Switch to English"
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("mr")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  language === "mr"
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                aria-label="मराठीमध्ये बदला"
              >
                मराठी
              </button>
            </div>

            {/* Primary CTA Button */}
            <Link
              href="/counselling"
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm shadow-emerald-900/10 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-emerald-200" />
              {t("nav.startCounselling")}
            </Link>
          </div>

          {/* Mobile menu controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "mr" : "en")}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-slate-50 text-slate-800"
            >
              {language === "en" ? "मराठी" : "EN"}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
          <div className="grid grid-cols-1 gap-1 pt-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? "bg-emerald-50 text-emerald-900 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-emerald-700" : "text-slate-400"
                    }`}
                  />
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
              <Sparkles className="w-4 h-4 text-emerald-200" />
              {t("nav.startCounselling")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
