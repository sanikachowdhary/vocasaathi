import { FamilyProfile, ObjectionCategory } from "@/lib/types";
import { StructuredAIResponse } from "@/lib/counselling/responseGenerator";

export interface AIProviderInterface {
  generateCounsellingResponse(params: {
    query: string;
    profile: FamilyProfile;
    currentResistance: number;
    turnCount: number;
    conversationHistory: Array<{ sender: "user" | "ai"; text: string }>;
    language: "en" | "mr";
  }): Promise<StructuredAIResponse>;
}
