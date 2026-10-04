import { AIProviderInterface } from "./aiProvider";
import { FamilyProfile } from "@/lib/types";
import { classifyObjection } from "@/lib/counselling/objectionClassifier";
import { retrieveEvidence } from "@/lib/counselling/evidenceRetriever";
import { calculateUpdatedResistance } from "@/lib/counselling/sentimentAnalyzer";
import { evaluateEscalation } from "@/lib/counselling/escalationEngine";
import { generateStructuredResponse, StructuredAIResponse } from "@/lib/counselling/responseGenerator";

export class MockAIProvider implements AIProviderInterface {
  async generateCounsellingResponse(params: {
    query: string;
    profile: FamilyProfile;
    currentResistance: number;
    turnCount: number;
    conversationHistory: Array<{ sender: "user" | "ai"; text: string }>;
    language: "en" | "mr";
  }): Promise<StructuredAIResponse> {
    const { query, profile, currentResistance, turnCount, language } = params;

    // 1. Classify the core parental objection
    const objection = classifyObjection(query);

    // 2. Retrieve verified quantitative evidence from seeded datasets
    const evidence = retrieveEvidence(query, profile, objection);

    // 3. Calculate dynamic resistance score shift
    const resistanceResult = calculateUpdatedResistance(
      currentResistance,
      objection,
      query,
      turnCount
    );

    // 4. Check for human escalation triggers
    const escalationResult = evaluateEscalation(
      query,
      profile,
      resistanceResult.score,
      turnCount,
      [objection]
    );

    // 5. Generate 5-part structured family response
    const structuredResponse = generateStructuredResponse({
      query,
      profile,
      objection,
      evidence,
      newResistanceScore: resistanceResult.score,
      shouldEscalate: escalationResult.shouldEscalate,
      language,
    });

    return structuredResponse;
  }
}
