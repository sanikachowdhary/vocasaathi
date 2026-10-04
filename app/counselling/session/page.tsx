"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { FamilyProfile, ChatMessage, Trade, ObjectionCategory, CounsellingSession } from "@/lib/types";
import { SessionStorageManager, DEFAULT_DEMO_FAMILY } from "@/lib/storage";
import { DataProvider } from "@/lib/data/dataProvider";
import { FamilyContextCard } from "@/components/counselling/FamilyContextCard";
import { ResistanceMeter } from "@/components/counselling/ResistanceMeter";
import { AudioSpeaker } from "@/components/counselling/AudioSpeaker";
import { EscalationModal } from "@/components/counselling/EscalationModal";
import { EvidenceCard } from "@/components/evidence/EvidenceCard";
import { CareerPathway } from "@/components/pathway/CareerPathway";
import {
  Send,
  Sparkles,
  Headphones,
  Bot,
  User,
  ShieldCheck,
  Compass,
  ArrowRight,
  GitCompare,
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function CounsellingSessionPage() {
  const { language, t } = useLanguage();
  const isMarathi = language === "mr";

  const [profile, setProfile] = useState<FamilyProfile>(DEFAULT_DEMO_FAMILY);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [initialResistance, setInitialResistance] = useState<number>(72);
  const [currentResistance, setCurrentResistance] = useState<number>(72);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeEvidence, setActiveEvidence] = useState<Trade[]>([]);
  const [detectedObjections, setDetectedObjections] = useState<string[]>([]);
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [showMobileContext, setShowMobileContext] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load session state on mount (with full refresh resilience)
  useEffect(() => {
    const loadedProfile = SessionStorageManager.getProfile();
    setProfile(loadedProfile);

    const activeSession = SessionStorageManager.getActiveSession();
    const sessionId = activeSession?.id || `sess-${Date.now()}`;
    setActiveSessionId(sessionId);

    const loadedResistance = SessionStorageManager.getResistance();
    setCurrentResistance(loadedResistance);
    setInitialResistance(activeSession?.initialResistance || 72);

    const savedMessages = SessionStorageManager.getChatMessages();
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
      const allEv = savedMessages.flatMap((m) => m.evidenceCards || []);
      if (allEv.length > 0) {
        setActiveEvidence(allEv);
      }
    } else {
      // Initialize welcoming message
      const defaultTrade = DataProvider.getTradeById("trade-electrician") || DataProvider.getAllTrades()[0];
      const initialGreeting: ChatMessage = {
        id: "msg-init",
        sender: "ai",
        text: isMarathi
          ? `नमस्कार! मी व्होकासाथी आहे. आम्ही ${loadedProfile.learnerName ? loadedProfile.learnerName + 'च्या' : 'विद्यार्थ्याच्या'} करिअर आणि भविष्यासाठी योग्य मार्ग निवडण्यात तुमच्या कुटुंबाला मदत करू.\n\nतुम्हाला पगार, नोकरीची हमी, सामाजिक प्रतिष्ठा किंवा पुढील शिक्षणाबद्दल काय प्रश्न आहेत? खालील पर्यायांमधून निवडा किंवा स्वतःचा प्रश्न विचारा.`
          : `Hello! I am VocaSaathi. We are here to help your family explore vocational pathways with confidence.\n\nWhat are your primary questions regarding starting salary, degree equivalence, career progression, or local job security in ${loadedProfile.locationDistrict}? Select a quick prompt or type your question below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        evidenceCards: [defaultTrade],
        suggestedActions: [
          { label: isMarathi ? "पगार किती मिळतो?" : "Starting Salary & Growth", labelMr: "पगार किती मिळतो?", actionType: "ask_question", payload: isMarathi ? "ITI ke baad kitna salary milega?" : "What is the starting salary and 3-year growth?" },
          { label: isMarathi ? "डिग्री बरी नाही का?" : "Degree vs Vocational", labelMr: "डिग्री बरी नाही का?", actionType: "ask_question", payload: isMarathi ? "Degree karna better nahi hai kya?" : "Is a traditional 3-year degree better than vocational training?" },
          { label: isMarathi ? "पुढे शिकता येईल का?" : "Higher Education Pathway", labelMr: "पुढे शिकता येईल का?", actionType: "ask_question", payload: isMarathi ? "पुढे शिकता येईल का? Lateral Diploma entry?" : "Can my child pursue lateral diploma or B.Voc degree later?" },
        ]
      };

      setMessages([initialGreeting]);
      setActiveEvidence([defaultTrade]);
      SessionStorageManager.saveChatMessages([initialGreeting], loadedResistance);
    }
  }, [language, isMarathi]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    setErrorMessage(null);
    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/counselling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          profile,
          sessionId: activeSessionId,
          currentResistance,
          turnCount: messages.length + 1,
          conversationHistory: newMessages.map((m) => ({ sender: m.sender, text: m.text })),
          language: isMarathi ? "mr" : "en",
        }),
      });

      const data = await res.json();

      if (data && data.message) {
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          concern: data.concern,
          evidenceCards: data.evidence,
          resistanceScore: data.resistanceScore,
          escalationRecommended: data.escalationRecommended,
          suggestedActions: data.recommendedActions,
        };

        const finalMessages = [...newMessages, aiMessage];
        setMessages(finalMessages);

        const newResistance = typeof data.resistanceScore === "number" ? data.resistanceScore : currentResistance;
        setCurrentResistance(newResistance);

        // Persistent save
        SessionStorageManager.saveChatMessages(finalMessages, newResistance);

        if (data.evidence && data.evidence.length > 0) {
          setActiveEvidence(data.evidence);
        }

        if (data.concern && !detectedObjections.includes(data.concern)) {
          setDetectedObjections((prev) => [...prev, data.concern]);
        }
      } else {
        throw new Error(data.error || "Could not retrieve counselling response");
      }
    } catch (err: any) {
      console.warn("API counselling call encountered an issue, using local intelligence:", err);
      // Fallback response so user never experiences a broken chat
      const fallbackTrade = activeEvidence[0] || DataProvider.getAllTrades()[0];
      const fallbackAiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: isMarathi
          ? `**१. स्वागत व समजून घेणे:** पालक म्हणून ही शंका अत्यंत स्वाभाविक आणि महत्त्वाची आहे.\n\n` +
            `**२. स्पष्ट उत्तर:** ${fallbackTrade.nameMr} या क्षेत्रात ${profile.locationDistrict} परिसरामध्ये नियमित रोजगार संधी उपलब्ध आहेत.\n\n` +
            `**३. वस्तुनिष्ठ पुरावा (डेटा):** प्लेसमेंट दर **${fallbackTrade.placementRate}%** असून सुरुवातीचा पगार **₹${fallbackTrade.medianEarnings.toLocaleString('en-IN')}/महिना** आहे (एनएसक्यूएफ स्तर ${fallbackTrade.nsqfLevel}).\n\n` +
            `**४. तुमच्या कुटुंबासाठी महत्त्व:** २ वर्षांत प्रत्यक्ष आर्थिक स्वावलंबन मिळवून पदवीचे मार्गही खुले राहतात.\n\n` +
            `**५. पुढील पाऊल:** करिअर प्रगतीचा नकाशा पहा किंवा समुपदेशकांशी संपर्क साधा.`
          : `**1. Acknowledge:** That is an important and valid concern for any family.\n\n` +
            `**2. Direct Answer:** ${fallbackTrade.name} offers dependable local employment opportunities in ${profile.locationDistrict}.\n\n` +
            `**3. Evidence Breakdown:** Outcome data indicates an **${fallbackTrade.placementRate}% placement rate** with **₹${fallbackTrade.medianEarnings.toLocaleString('en-IN')}/month** starting median earnings (NSQF Level ${fallbackTrade.nsqfLevel}).\n\n` +
            `**4. Family Context:** Enables quick financial security while keeping lateral degree pathways accessible.\n\n` +
            `**5. Next Step:** Inspect the career pathway ladder or request a human counsellor call.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        evidenceCards: [fallbackTrade],
        resistanceScore: Math.max(20, currentResistance - 12),
        suggestedActions: [
          { label: isMarathi ? "करिअर प्रगतीचा नकाशा पहा" : "View Career Pathway", labelMr: "करिअर प्रगतीचा नकाशा पहा", actionType: "view_pathway" },
          { label: isMarathi ? "तज्ज्ञ समुपदेशकांशी बोला" : "Talk to a Counsellor", labelMr: "तज्ज्ञ समुपदेशकांशी बोला", actionType: "talk_counsellor" },
        ]
      };

      const finalMessages = [...newMessages, fallbackAiMessage];
      setMessages(finalMessages);
      const newScore = Math.max(20, currentResistance - 12);
      setCurrentResistance(newScore);
      SessionStorageManager.saveChatMessages(finalMessages, newScore);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetSession = () => {
    SessionStorageManager.resetSession();
    window.location.reload();
  };

  const quickPrompts = [
    { text: isMarathi ? "ITI ke baad achhi job milegi kya?" : "Will there be good job security after an ITI/vocational course?" },
    { text: isMarathi ? "पगार किती मिळतो? (Salary growth?)" : "What is the starting salary and experienced income progression?" },
    { text: isMarathi ? "Degree karna better nahi hai kya?" : "Is pursuing a regular 3-year college degree better than vocational skilling?" },
    { text: isMarathi ? "पुढे शिकता येईल का? (Lateral Entry)" : "Can my child pursue higher education / Polytechnic lateral entry later?" },
    { text: isMarathi ? "Will my child get a job near Pune?" : "Will my child get a formal job locally in Pune or Maharashtra?" },
    { text: isMarathi ? "कामाच्या ठिकाणी सुरक्षितता कशी आहे?" : "Is the industrial workplace safe and regulated?" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner / Session Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-2xs">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {t("counselling.chatTitle")}
              </h1>
              <span className="text-[10px] font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {profile.learnerName || "Candidate"} ({profile.locationDistrict})
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {isMarathi ? "पुराव्यांवर आधारित कौटुंबिक समुपदेशन व संवाद कक्ष" : "Evidence-backed family mediation workspace"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile context accordion toggle */}
          <button
            type="button"
            onClick={() => setShowMobileContext(!showMobileContext)}
            className="lg:hidden px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 flex items-center gap-1"
          >
            <span>{isMarathi ? "कुटुंबाची पार्श्वभूमी" : "Family Profile"}</span>
            {showMobileContext ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsEscalationOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-xs transition-colors"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>{t("counselling.talkToCounsellor")}</span>
          </button>

          <button
            type="button"
            onClick={handleResetSession}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Context View */}
      {showMobileContext && (
        <div className="lg:hidden space-y-4 animate-in fade-in">
          <FamilyContextCard
            profile={profile}
            initialResistance={initialResistance}
            currentResistance={currentResistance}
          />
          <ResistanceMeter
            initialScore={initialResistance}
            currentScore={currentResistance}
          />
        </div>
      )}

      {/* 3-COLUMN DESKTOP WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Family Context & Resistance Gauge (3 cols on lg) */}
        {/* ========================================================================= */}
        <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
          <FamilyContextCard
            profile={profile}
            initialResistance={initialResistance}
            currentResistance={currentResistance}
          />
          <ResistanceMeter
            initialScore={initialResistance}
            currentScore={currentResistance}
          />
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: Family Conversation & Audio Player (5 cols on lg) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-md flex flex-col h-[750px] overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                {isMarathi ? "व्होकासाथी एआय समुपदेशक" : "VocaSaathi Family AI"}
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              Active Session
            </span>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm space-y-2 shadow-2xs ${
                    isAi
                      ? "bg-slate-50 border border-slate-200 text-slate-800"
                      : "bg-emerald-700 text-white font-medium"
                  }`}>
                    {/* Message Body with clean paragraph rendering */}
                    <div className="whitespace-pre-line leading-relaxed">
                      {msg.text}
                    </div>

                    {/* AI Tools Footer: Audio Listen Button + Timestamp */}
                    {isAi && (
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                        <AudioSpeaker textToSpeak={msg.text} />
                        <span className="text-[10px] text-slate-400 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>
                    )}

                    {!isAi && (
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-200 font-mono">
                          {msg.timestamp}
                        </span>
                      </div>
                    )}

                    {/* Suggested Action Chips */}
                    {isAi && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((act, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (act.actionType === "talk_counsellor") {
                                setIsEscalationOpen(true);
                              } else if (act.actionType === "compare") {
                                window.open("/compare", "_blank");
                              } else if (act.payload) {
                                handleSendMessage(act.payload);
                              }
                            }}
                            className="text-[11px] font-bold bg-white text-emerald-800 hover:bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80 transition-colors shadow-2xs flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <span>{isMarathi ? act.labelMr : act.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1 shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 font-medium">{isMarathi ? "डेटा तपासत आहे..." : "Retrieving outcome evidence..."}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Objection Prompts Bar */}
          <div className="px-4 py-2 bg-slate-50/60 border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p.text)}
                className="flex-shrink-0 text-[11px] font-semibold bg-white text-slate-700 hover:text-emerald-800 hover:border-emerald-300 px-2.5 py-1 rounded-full border border-slate-200 transition-colors shadow-2xs"
              >
                {p.text}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t("counselling.inputPlaceholder")}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm font-medium"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="px-4 sm:px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 shadow-xs transition-all flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <span>{t("counselling.send")}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Evidence Used & Interactive Pathway (4 cols on lg) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {t("counselling.evidenceTitle")}
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full">
                Active Evidence
              </span>
            </div>

            {/* Active Evidence Cards */}
            {activeEvidence.length > 0 ? (
              <div className="space-y-4">
                {activeEvidence.map((trade) => (
                  <EvidenceCard key={trade.id} trade={trade} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                {t("counselling.noEvidenceYet")}
              </div>
            )}
          </div>

          {/* Interactive Career Progression Pathway Card */}
          {activeEvidence.length > 0 && (
            <CareerPathway trade={activeEvidence[0]} />
          )}

          {/* Escalation CTA Callout Card */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-5 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold">
                {isMarathi ? "प्रत्यक्ष तज्ज्ञ समुपदेशकाशी बोला" : "Connect with a Vocational Counsellor"}
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t("counselling.escalationPrompt")}
            </p>
            <button
              type="button"
              onClick={() => setIsEscalationOpen(true)}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>{t("counselling.talkToCounsellor")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Human Escalation Modal */}
      <EscalationModal
        isOpen={isEscalationOpen}
        onClose={() => setIsEscalationOpen(false)}
        profile={profile}
        initialResistance={initialResistance}
        currentResistance={currentResistance}
        evidenceShown={activeEvidence}
        detectedObjections={detectedObjections}
      />
    </div>
  );
}
