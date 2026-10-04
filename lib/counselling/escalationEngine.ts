import { FamilyProfile, ObjectionCategory, CounsellorCase } from "@/lib/types";

export interface EscalationCheckResult {
  shouldEscalate: boolean;
  reason: string;
  reasonMr: string;
  priority: "High" | "Urgent" | "Normal";
}

export function evaluateEscalation(
  query: string,
  profile: FamilyProfile,
  currentResistance: number,
  turnCount: number,
  objectionsList: ObjectionCategory[]
): EscalationCheckResult {
  const q = query.toLowerCase();

  // 1. Explicit user request
  if (
    q.includes("counsellor") ||
    q.includes("counselor") ||
    q.includes("human") ||
    q.includes("phone") ||
    q.includes("call") ||
    q.includes("समुपदेशक") ||
    q.includes("फोन") ||
    q.includes("बोलायचे")
  ) {
    return {
      shouldEscalate: true,
      reason: "Family explicitly requested a 1-on-1 discussion with a certified counsellor.",
      reasonMr: "कुटुंबाने स्वतःहून तज्ज्ञ समुपदेशकांशी प्रत्यक्ष बोलण्याची विनंती केली.",
      priority: "High",
    };
  }

  // 2. High Resistance after 3 turns
  if (currentResistance >= 65 && turnCount >= 3) {
    return {
      shouldEscalate: true,
      reason: "Parental hesitation remains elevated despite multi-turn evidence presentation.",
      reasonMr: "वारंवार माहिती देऊनही पालकांच्या मनातील चिंता कायम असल्याने समुपदेशकाची मदत आवश्यक आहे.",
      priority: "Urgent",
    };
  }

  // 3. Persistent Degree Stigma or Conflicting Expectations
  const degreeObjectionCount = objectionsList.filter((o) => o === "social_status").length;
  if (degreeObjectionCount >= 2) {
    return {
      shouldEscalate: true,
      reason: "Family experiences strong generational conflict between academic degree prestige and practical vocational skilling.",
      reasonMr: "पारंपरिक पदवी आणि कौशल्याच्या शिक्षणातील सामाजिक दर्जामुळे कुटुंबात मतभेद जाणवत आहेत.",
      priority: "Normal",
    };
  }

  return {
    shouldEscalate: false,
    reason: "No immediate human intervention trigger met; automated evidence counselling is sufficient.",
    reasonMr: "एआय आणि आकडेवारीच्या साहाय्याने समाधानकारक संवाद चालू आहे.",
    priority: "Normal",
  };
}

export function createCasePayload(params: {
  sessionId: string;
  profile: FamilyProfile;
  contactName: string;
  contactNumber: string;
  preferredTime: string;
  preferredLanguage: "en" | "mr";
  currentResistance: number;
  initialResistance: number;
  transcriptSummary: string;
  detectedObjections: string[];
  evidenceShown: string[];
  priority: "High" | "Urgent" | "Normal";
}): CounsellorCase {
  const caseId = `CASE-MH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  return {
    id: caseId,
    sessionId: params.sessionId,
    familyName: params.profile.learnerName ? `${params.profile.learnerName} Family` : "Candidate Family",
    learnerName: params.profile.learnerName || "Candidate",
    learnerAge: params.profile.learnerAge || 19,
    education: params.profile.education || "12th Pass",
    contactNumber: params.contactNumber,
    preferredLanguage: params.preferredLanguage,
    preferredContactTime: params.preferredTime,
    district: params.profile.locationDistrict || "Pune",
    state: params.profile.locationState || "Maharashtra",
    priority: params.priority,
    status: "New",
    primaryConcern: params.profile.primaryConcern,
    initialResistance: params.initialResistance,
    resistanceScore: params.currentResistance,
    transcriptSummary: params.transcriptSummary,
    detectedObjections: params.detectedObjections,
    evidenceShown: params.evidenceShown,
    recommendedActions: [
      `Review local admission availability for ${params.evidenceShown[0] || 'vocational trade'} in ${params.profile.locationDistrict}.`,
      `Clarify apprenticeship stipend rules & lateral diploma quotas for 12th pass applicants.`,
      `Offer empathetic reassurance regarding family prestige and formal career growth.`
    ],
    notes: "Case auto-generated from VocaSaathi session escalation.",
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
}
