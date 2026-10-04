import { NextRequest, NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai/geminiProvider";
import { FamilyProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, profile, currentResistance, turnCount, conversationHistory, language } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required." },
        { status: 400 }
      );
    }

    const provider = getAIProvider();
    const response = await provider.generateCounsellingResponse({
      query,
      profile: profile || {
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
      },
      currentResistance: typeof currentResistance === "number" ? currentResistance : 72,
      turnCount: turnCount || 1,
      conversationHistory: conversationHistory || [],
      language: language === "mr" ? "mr" : "en",
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("API /api/counselling error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate counselling response" },
      { status: 500 }
    );
  }
}
