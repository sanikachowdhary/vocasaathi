"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface AudioSpeakerProps {
  textToSpeak: string;
}

export function AudioSpeaker({ textToSpeak }: AudioSpeakerProps) {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setIsSupported(false);
    }
  }, []);

  const cleanTextForSpeech = (raw: string) => {
    // Strip markdown formatting (*, #, _, etc.)
    return raw
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/#/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/[\n\r]+/g, " ");
  };

  const toggleSpeech = () => {
    if (!isSupported || typeof window === "undefined") return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any existing speech

    const cleaned = cleanTextForSpeech(textToSpeak);
    const utterance = new SpeechSynthesisUtterance(cleaned);

    utterance.lang = language === "mr" ? "mr-IN" : "en-IN";
    utterance.rate = 0.95; // Slightly slower for low-literacy clarity
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleSpeech}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
        isPlaying
          ? "bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/40"
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
      }`}
      title={isPlaying ? "Stop speech" : "Listen in speech"}
      aria-label={isPlaying ? "Stop audio speech" : "Listen to answer in audio"}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          <span>{language === "mr" ? "थांबवा" : "Stop"}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>{language === "mr" ? "उत्तर ऐका (🔊 Listen)" : "Listen 🔊"}</span>
        </>
      )}
    </button>
  );
}
