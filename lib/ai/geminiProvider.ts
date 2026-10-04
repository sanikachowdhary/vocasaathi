import { AIProviderInterface } from "./aiProvider";
import { FamilyProfile } from "@/lib/types";
import { MockAIProvider } from "./mockProvider";
import { classifyObjection } from "@/lib/counselling/objectionClassifier";
import { retrieveEvidence } from "@/lib/counselling/evidenceRetriever";
import { calculateUpdatedResistance } from "@/lib/counselling/sentimentAnalyzer";
import { evaluateEscalation } from "@/lib/counselling/escalationEngine";
import { StructuredAIResponse } from "@/lib/counselling/responseGenerator";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiAIProvider implements AIProviderInterface {
  private apiKey: string | undefined;
  private mockFallback: MockAIProvider;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.mockFallback = new MockAIProvider();
  }

  async generateCounsellingResponse(params: {
    query: string;
    profile: FamilyProfile;
    currentResistance: number;
    turnCount: number;
    conversationHistory: Array<{ sender: "user" | "ai"; text: string }>;
    language: "en" | "mr";
  }): Promise<StructuredAIResponse> {
    // If no API key is configured, seamlessly execute deterministic local intelligence
    if (!this.apiKey) {
      return this.mockFallback.generateCounsellingResponse(params);
    }

    try {
      const { query, profile, currentResistance, turnCount, language } = params;
      const objection = classifyObjection(query);
      const evidence = retrieveEvidence(query, profile, objection);
      const resistanceResult = calculateUpdatedResistance(
        currentResistance,
        objection,
        query,
        turnCount
      );
      const escalationResult = evaluateEscalation(
        query,
        profile,
        resistanceResult.score,
        turnCount,
        [objection]
      );

      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const trade = evidence.primaryTrade!;
      const prompt = `
You are VocaSaathi, an evidence-first vocational counselling assistant for Indian families.
Respond in ${language === "mr" ? "pure natural Marathi" : "clear English"}.

CRITICAL ETHICAL RULES:
1. Speak warmly and respectfully to the family/parent.
2. ONLY use the quantitative numbers provided in the EVIDENCE BLOCK below. DO NOT hallucinate fake government surveys or fabricate numbers.
3. Structure your response into exactly 5 short numbered sections:
   1. Acknowledge the parent's concern warmly.
   2. Direct simple answer.
   3. Evidence data points (Placement rate, salary range, NSQF level).
   4. Family context implication (relate to ${profile.locationDistrict} and learner age ${profile.learnerAge}).
   5. Next actionable step.

EVIDENCE BLOCK:
- Trade Name: ${trade.name} (${trade.nameMr})
- Sector: ${trade.sector}
- NSQF Level: ${trade.nsqfLevel}
- Duration: ${trade.duration}
- Placement Rate: ${trade.placementRate}%
- Median Starting Earnings: ₹${trade.medianEarnings}/month
- Earnings Range: ₹${trade.earningsLow} to ₹${trade.earningsHigh}/month
- Experienced Pay: ${trade.experienceEarnings}
- Safety Info: ${trade.safetyInfo}
- Higher Education Ladder: ${trade.higherEducationOptions.join(", ")}

USER QUERY: "${query}"
`;

      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();

      return {
        message: generatedText,
        concern: objection,
        evidence: evidence.trades,
        recommendedActions: [
          { label: language === "mr" ? "करिअर प्रगतीचा नकाशा पहा" : "View Career Pathway", labelMr: "करिअर प्रगतीचा नकाशा पहा", actionType: "view_pathway" },
          { label: language === "mr" ? "इतर कोर्सेसशी तुलना करा" : "Compare with Other Trades", labelMr: "इतर कोर्सेसशी तुलना करा", actionType: "compare" },
          { label: language === "mr" ? "तज्ज्ञ समुपदेशकांशी बोला" : "Talk to a Counsellor", labelMr: "तज्ज्ञ समुपदेशकांशी बोला", actionType: "talk_counsellor" }
        ],
        resistanceScore: resistanceResult.score,
        escalationRecommended: escalationResult.shouldEscalate,
        explanation: `Gemini AI response strictly grounded in ${trade.name} evidence metrics.`,
      };
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local deterministic engine:", err);
      return this.mockFallback.generateCounsellingResponse(params);
    }
  }
}

// Factory Helper
export function getAIProvider(): AIProviderInterface {
  if (process.env.GEMINI_API_KEY) {
    return new GeminiAIProvider();
  }
  return new MockAIProvider();
}
