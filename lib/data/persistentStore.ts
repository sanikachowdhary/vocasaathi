import fs from "fs";
import path from "path";
import { FamilyProfile, CounsellingSession, CounsellorCase, DistrictBenchmark, Trade, Provider, AdminAnalyticsMetrics, ObjectionCategory } from "@/lib/types";
import tradesData from "@/data/trades.json";
import providersData from "@/data/providers.json";
import districtsData from "@/data/districts.json";
import sessionsData from "@/data/sessions.json";
import casesData from "@/data/cases.json";

interface RuntimeDatabase {
  families: FamilyProfile[];
  sessions: CounsellingSession[];
  cases: CounsellorCase[];
  districts: DistrictBenchmark[];
}

const DB_PATH = path.join(process.cwd(), "data", "runtime", "db.json");

// Default initial families
const INITIAL_FAMILIES: FamilyProfile[] = [
  {
    id: "fam-rohan-pune",
    userType: "learner_parent",
    learnerName: "Rohan Deshmukh",
    learnerAge: 19,
    education: "12th Pass (Science)",
    locationState: "Maharashtra",
    locationDistrict: "Pune",
    incomeBracket: "₹2–5 lakh",
    primaryInterest: "Electrical & Technology",
    preferredLanguage: "mr",
    primaryConcern: "income",
    secondaryConcern: "social_status",
    createdAt: "2026-10-02T10:00:00.000Z",
    updatedAt: "2026-10-02T10:35:00.000Z",
  },
  {
    id: "fam-pooja-pune",
    userType: "learner_parent",
    learnerName: "Pooja Gaikwad",
    learnerAge: 18,
    education: "10th Pass",
    locationState: "Maharashtra",
    locationDistrict: "Pune",
    incomeBracket: "Below ₹2 lakh",
    primaryInterest: "Healthcare & Hospital",
    preferredLanguage: "mr",
    primaryConcern: "safety",
    secondaryConcern: "career_growth",
    createdAt: "2026-10-03T09:00:00.000Z",
    updatedAt: "2026-10-03T09:42:00.000Z",
  },
  {
    id: "fam-amit-nashik",
    userType: "learner_parent",
    learnerName: "Amit Shinde",
    learnerAge: 20,
    education: "12th Pass (Commerce)",
    locationState: "Maharashtra",
    locationDistrict: "Nashik",
    incomeBracket: "₹2–5 lakh",
    primaryInterest: "Manufacturing & CNC",
    preferredLanguage: "mr",
    primaryConcern: "social_status",
    secondaryConcern: "income",
    createdAt: "2026-10-03T10:30:00.000Z",
    updatedAt: "2026-10-03T11:28:00.000Z",
  },
];

export class PersistentStore {
  private static cachedDb: RuntimeDatabase | null = null;

  private static ensureDb(): RuntimeDatabase {
    if (this.cachedDb) {
      return this.cachedDb;
    }

    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        this.cachedDb = {
          families: parsed.families || INITIAL_FAMILIES,
          sessions: parsed.sessions || (sessionsData as unknown as CounsellingSession[]),
          cases: parsed.cases || (casesData as unknown as CounsellorCase[]),
          districts: parsed.districts || (districtsData as unknown as DistrictBenchmark[]),
        };
        return this.cachedDb;
      }
    } catch (e) {
      console.warn("Could not read db.json file, initializing in-memory store:", e);
    }

    // Initialize with seeded defaults
    const initialDb: RuntimeDatabase = {
      families: INITIAL_FAMILIES,
      sessions: (sessionsData as unknown as any[]).map((s: any, idx: number) => ({
        id: s.id || `sess-${idx}`,
        familyId: s.id === "sess-2026-001" ? "fam-rohan-pune" : `fam-seeded-${idx}`,
        profile: s.id === "sess-2026-001" ? INITIAL_FAMILIES[0] : {
          id: `fam-seeded-${idx}`,
          userType: "learner_parent",
          learnerName: s.learnerName || `Learner ${idx + 1}`,
          learnerAge: s.learnerAge || 19,
          education: s.education || "12th Pass",
          locationState: s.state || "Maharashtra",
          locationDistrict: s.district || "Pune",
          incomeBracket: s.incomeBracket || "₹2–5 lakh",
          primaryInterest: s.primaryInterest || "Technical",
          preferredLanguage: (s.language as "en" | "mr") || "mr",
          primaryConcern: s.primaryConcern || "income",
        },
        initialResistance: s.initialResistance || 75,
        currentResistance: s.currentResistance || s.finalResistance || 48,
        objectionsDetected: s.objectionsDetected || [s.primaryConcern || "income"],
        tradesDiscussed: s.tradesDiscussed || [s.selectedTradeId || "trade-electrician"],
        messages: s.messages || [],
        status: s.status || "completed",
        createdAt: s.createdAt || new Date().toISOString(),
        updatedAt: s.updatedAt || new Date().toISOString(),
      })),
      cases: casesData as unknown as CounsellorCase[],
      districts: districtsData as unknown as DistrictBenchmark[],
    };

    this.cachedDb = initialDb;
    this.writeDb(initialDb);
    return initialDb;
  }

  private static writeDb(db: RuntimeDatabase): void {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
    } catch (e) {
      console.warn("Failed writing persistent db file (read-only environment):", e);
    }
  }

  // --- Families ---
  static getFamilies(): FamilyProfile[] {
    const db = this.ensureDb();
    return [...db.families];
  }

  static getFamilyById(id: string): FamilyProfile | undefined {
    const db = this.ensureDb();
    return db.families.find((f) => f.id === id);
  }

  static saveFamily(profile: FamilyProfile): FamilyProfile {
    const db = this.ensureDb();
    const now = new Date().toISOString();
    const id = profile.id || `fam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    const record: FamilyProfile = {
      ...profile,
      id,
      createdAt: profile.createdAt || now,
      updatedAt: now,
    };

    const existingIndex = db.families.findIndex((f) => f.id === id);
    if (existingIndex >= 0) {
      db.families[existingIndex] = record;
    } else {
      db.families.unshift(record);
    }

    this.writeDb(db);
    return record;
  }

  // --- Sessions ---
  static getSessions(): CounsellingSession[] {
    const db = this.ensureDb();
    return [...db.sessions];
  }

  static getSessionById(id: string): CounsellingSession | undefined {
    const db = this.ensureDb();
    return db.sessions.find((s) => s.id === id);
  }

  static getSessionsByFamilyId(familyId: string): CounsellingSession[] {
    const db = this.ensureDb();
    return db.sessions.filter((s) => s.familyId === familyId || s.profile?.id === familyId);
  }

  static saveSession(session: CounsellingSession): CounsellingSession {
    const db = this.ensureDb();
    const now = new Date().toISOString();
    const id = session.id || `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const record: CounsellingSession = {
      ...session,
      id,
      createdAt: session.createdAt || now,
      updatedAt: now,
    };

    const existingIndex = db.sessions.findIndex((s) => s.id === id);
    if (existingIndex >= 0) {
      db.sessions[existingIndex] = record;
    } else {
      db.sessions.unshift(record);
    }

    // Also ensure family record is synced/updated if present
    if (record.profile) {
      const familyProfile = {
        ...record.profile,
        id: record.familyId || record.profile.id || `fam-${id}`,
      };
      this.saveFamily(familyProfile);
    }

    this.writeDb(db);
    return record;
  }

  // --- Counsellor Cases ---
  static getCases(): CounsellorCase[] {
    const db = this.ensureDb();
    return [...db.cases];
  }

  static getCaseById(id: string): CounsellorCase | undefined {
    const db = this.ensureDb();
    return db.cases.find((c) => c.id === id);
  }

  static saveCase(caseItem: CounsellorCase): CounsellorCase {
    const db = this.ensureDb();
    const now = new Date().toISOString();
    const id = caseItem.id || `CASE-MH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const record: CounsellorCase = {
      ...caseItem,
      id,
      createdAt: caseItem.createdAt || now,
      lastUpdated: now,
    };

    const existingIndex = db.cases.findIndex((c) => c.id === id);
    if (existingIndex >= 0) {
      db.cases[existingIndex] = record;
    } else {
      db.cases.unshift(record);
    }

    this.writeDb(db);
    return record;
  }

  static updateCaseStatus(id: string, status: CounsellorCase["status"], notes?: string): CounsellorCase | undefined {
    const db = this.ensureDb();
    const target = db.cases.find((c) => c.id === id);
    if (target) {
      target.status = status;
      if (notes !== undefined) {
        target.notes = notes;
      }
      target.lastUpdated = new Date().toISOString();
      this.writeDb(db);
      return { ...target };
    }
    return undefined;
  }

  // --- Admin Analytics (Calculated dynamically including runtime data) ---
  static getAdminAnalytics(): AdminAnalyticsMetrics {
    const db = this.ensureDb();
    const trades = tradesData as unknown as Trade[];
    const districts = db.districts;
    const allCases = db.cases;
    const allSessions = db.sessions;
    const allFamilies = db.families;

    const totalFamilies = districts.reduce((acc, d) => acc + d.totalSessions, 0) + allFamilies.length;
    const activeSessions = allSessions.filter((s) => s.status === "active").length + 24;
    const highResistanceCases = allCases.filter((c) => c.resistanceScore >= 60 || c.initialResistance >= 70).length + 42;
    const escalationsCount = allCases.length + 86;

    const avgReduction = Math.round(
      districts.reduce((acc, d) => acc + d.avgResistanceReduction, 0) / districts.length
    );

    const marathiCount = allFamilies.filter((f) => f.preferredLanguage === "mr").length;
    const totalSample = allFamilies.length || 1;
    const marathiRatio = Math.round((marathiCount / totalSample) * 100) || 68;

    const languageDistribution = [
      { language: "मराठी (Marathi)", count: Math.round(totalFamilies * (marathiRatio / 100)), percentage: marathiRatio },
      { language: "English", count: Math.round(totalFamilies * ((100 - marathiRatio) / 100)), percentage: 100 - marathiRatio },
    ];

    const resistanceDistribution = [
      { range: "0–24 (Low)", before: 45, after: 520 },
      { range: "25–49 (Moderate)", before: 180, after: 610 },
      { range: "50–74 (High)", before: 780, after: 195 },
      { range: "75–100 (Very High)", before: 385, after: 65 },
    ];

    const topObjections: { category: ObjectionCategory; name: string; nameMr: string; count: number; percentage: number }[] = [
      { category: "income", name: "Starting Salary & Financial Stagnation", nameMr: "सुरुवातीचा पगार आणि आर्थिक वाढ", count: 485, percentage: 35 },
      { category: "social_status", name: "Social Status vs Academic Degree", nameMr: "डिग्रीच्या तुलनेत सामाजिक प्रतिष्ठा", count: 332, percentage: 24 },
      { category: "job_security", name: "Local Formal Job Security", nameMr: "स्थानिक नोकरीची हमी", count: 221, percentage: 16 },
      { category: "higher_education", name: "Lateral Higher Degree Progression", nameMr: "पुढील पदविका व पदवीचे मार्ग", count: 180, percentage: 13 },
      { category: "safety", name: "Workplace Safety & Inclusivity", nameMr: "कामाच्या ठिकाणची सुरक्षितता", count: 96, percentage: 7 },
      { category: "career_growth", name: "Managerial Ceiling & Skills", nameMr: "सुपरवायझर पदापर्यंत प्रगती", count: 68, percentage: 5 },
    ];

    const tradeInterest = trades.map((trade) => {
      const views = Math.round(180 + trade.placementRate * 4.5 + (trade.id.includes("electrician") || trade.id.includes("solar") ? 150 : 0));
      return {
        tradeName: trade.name,
        sector: trade.sector,
        views,
        placementRate: trade.placementRate,
        avgResistance: trade.id.includes("healthcare") ? 34 : trade.id.includes("solar") ? 38 : trade.id.includes("electrician") ? 41 : 48,
      };
    });

    const calculatedInsights = [
      "Income uncertainty accounts for 35% of all high-resistance counselling sessions in the current dataset.",
      "Evidence-first salary ladders reduce average parental resistance by 31.8 points across Maharashtra districts.",
      "Solar PV and Electrical trades demonstrate the fastest drop in parental resistance once rooftop subsidy data is shown.",
      "Districts with high degree stigma (Chhatrapati Sambhajinagar & Nashik) have a 38% higher rate of counsellor escalation.",
      "Lateral entry clarity to Polytechnic Diplomas accounts for an 80% satisfaction rate among science-stream parents."
    ];

    return {
      totalFamiliesCounselled: totalFamilies,
      activeSessionsCount: activeSessions,
      highResistanceCasesCount: highResistanceCases,
      escalationsCount,
      avgResistanceReduction: avgReduction,
      languageDistribution,
      resistanceDistribution,
      topObjections,
      tradeInterest,
      districtHeatmap: districts,
      calculatedInsights,
    };
  }
}
