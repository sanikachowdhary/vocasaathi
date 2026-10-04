export type ObjectionCategory = 
  | "income"
  | "job_security"
  | "social_status"
  | "safety"
  | "higher_education"
  | "career_growth"
  | "location"
  | "family_expectations"
  | "course_quality"
  | "placement";

export type ResistanceBand = "low" | "moderate" | "high" | "very_high";

export interface ProgressionStep {
  stepNumber: number;
  role: string;
  roleMr: string;
  experience: string;
  expectedEarnings: string;
  nsqfLevel: number;
  skills: string[];
  description: string;
  descriptionMr: string;
}

export interface Trade {
  id: string;
  name: string;
  nameMr: string;
  sector: string;
  sectorMr: string;
  nsqfLevel: number;
  duration: string;
  durationMonths: number;
  entryEducation: string;
  placementRate: number; // e.g. 78%
  medianEarnings: number; // e.g. 18500
  earningsLow: number; // e.g. 15000
  earningsHigh: number; // e.g. 24000
  experienceEarnings: string; // e.g. "₹35,000 - ₹45,000 after 3-4 years"
  jobRoles: string[];
  progression: ProgressionStep[];
  higherEducationOptions: string[];
  demandIndicator: "High" | "Very High" | "Moderate";
  safetyInfo: string;
  safetyInfoMr: string;
  genderInclusivity: string;
  genderInclusivityMr: string;
  state: string;
  district: string;
  providerIds: string[];
  source: string;
  dataPeriod: string;
  verificationStatus: "Verified Data" | "State Board Audited" | "Empirical Survey";
  summary: string;
  summaryMr: string;
}

export interface Provider {
  id: string;
  name: string;
  nameMr: string;
  state: string;
  district: string;
  address: string;
  tradeIds: string[];
  placementRate: number;
  completionRate: number;
  contactPhone: string;
  contactEmail: string;
  verificationStatus: "Government ITI" | "NSDC Partner" | "State Polytechnic";
  lastUpdated: string;
  type: "Govt ITI" | "Polytechnic" | "Private ITI" | "NSDC Centre";
  hostelAvailable: boolean;
  scholarshipAvailable: boolean;
}

export interface DistrictBenchmark {
  id: string;
  name: string;
  nameMr: string;
  state: string;
  totalSessions: number;
  avgInitialResistance: number;
  avgFinalResistance: number;
  avgResistanceReduction: number;
  escalationRate: number;
  topConcern: ObjectionCategory;
  topConcernLabel: string;
  topConcernLabelMr: string;
  topTrades: string[];
  hotspotIntensity: "High" | "Moderate" | "Normal";
}

export interface FamilyProfile {
  id?: string;
  userType: "learner" | "parent" | "learner_parent";
  learnerName: string;
  learnerAge: number;
  education: string;
  locationState: string;
  locationDistrict: string;
  incomeBracket: string;
  primaryInterest: string;
  preferredLanguage: "en" | "mr";
  primaryConcern: ObjectionCategory;
  secondaryConcern?: ObjectionCategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "counsellor" | "system";
  text: string;
  timestamp: string;
  concern?: ObjectionCategory;
  detectedObjection?: ObjectionCategory;
  evidenceCardIds?: string[]; // IDs of trades or providers
  evidenceCards?: Trade[];
  resistanceScore?: number;
  escalationRecommended?: boolean;
  suggestedActions?: Array<{
    label: string;
    labelMr: string;
    actionType: "ask_question" | "view_trade" | "compare" | "talk_counsellor" | "view_pathway";
    payload?: string;
  }>;
}

export interface CounsellorCase {
  id: string;
  sessionId: string;
  familyId?: string;
  familyName: string;
  learnerName: string;
  learnerAge: number;
  education: string;
  contactNumber: string;
  preferredLanguage: "en" | "mr";
  preferredContactTime: string;
  district: string;
  state: string;
  priority: "High" | "Urgent" | "Normal";
  status: "New" | "In Review" | "Contacted" | "Resolved";
  primaryConcern: ObjectionCategory;
  initialResistance: number;
  resistanceScore: number;
  transcriptSummary: string;
  detectedObjections: string[];
  evidenceShown: string[];
  recommendedActions: string[];
  notes?: string;
  createdAt: string;
  lastUpdated: string;
}

export interface CounsellingSession {
  id: string;
  familyId?: string;
  profile: FamilyProfile;
  initialResistance: number;
  currentResistance: number;
  objectionsDetected: ObjectionCategory[];
  tradesDiscussed: string[];
  messages: ChatMessage[];
  status: "active" | "escalated" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface AdminAnalyticsMetrics {
  totalFamiliesCounselled: number;
  activeSessionsCount: number;
  highResistanceCasesCount: number;
  escalationsCount: number;
  avgResistanceReduction: number;
  languageDistribution: { language: string; count: number; percentage: number }[];
  resistanceDistribution: { range: string; before: number; after: number }[];
  topObjections: { category: ObjectionCategory; name: string; nameMr: string; count: number; percentage: number }[];
  tradeInterest: { tradeName: string; sector: string; views: number; placementRate: number; avgResistance: number }[];
  districtHeatmap: DistrictBenchmark[];
  calculatedInsights: string[];
}
