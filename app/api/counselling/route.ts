import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai/geminiProvider";
import { FamilyProfile } from "@/lib/types";
import { PersistentStore } from "@/lib/data/persistentStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, profile, currentResistance, turnCount, conversationHistory, language, sessionId } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required." },
        { status: 400 }
      );
    }

    const familyProfile: FamilyProfile = profile || {
      id: "fam-rohan-pune",
      userType: "learner_parent",
      learnerName: "Rohan Deshmukh",
      learnerAge: 19,
      education: "12th Pass",
      locationState: "Maharashtra",
      locationDistrict: "Pune",
      incomeBracket: "₹2–5 lakh",
      primaryInterest: "Electrical & Technology",
      preferredLanguage: language || "mr",
      primaryConcern: "income",
    };

    const provider = getAIProvider();
    const response = await provider.generateCounsellingResponse({
      query,
      profile: familyProfile,
      currentResistance: typeof currentResistance === "number" ? currentResistance : 72,
      turnCount: turnCount || 1,
      conversationHistory: conversationHistory || [],
      language: language === "mr" ? "mr" : "en",
    });

    // Ensure family is saved in persistent store
    try {
      PersistentStore.saveFamily(familyProfile);
    } catch (e) {
      console.warn("Could not auto-save family in persistent store:", e);
    }

    return NextResponse.json({
      ...response,
      sessionId: sessionId || undefined,
    });
  } catch (error: any) {
    console.error("API /api/counselling error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate counselling response" },
      { status: 500 }
    );
  }
}
