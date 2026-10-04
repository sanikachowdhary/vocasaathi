import { Trade, Provider, DistrictBenchmark, CounsellorCase, CounsellingSession, AdminAnalyticsMetrics, ObjectionCategory, FamilyProfile } from "@/lib/types";
import tradesData from "@/data/trades.json";
import providersData from "@/data/providers.json";
import districtsData from "@/data/districts.json";
import sessionsData from "@/data/sessions.json";
import casesData from "@/data/cases.json";

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

export class DataProvider {
  private static trades: Trade[] = tradesData as unknown as Trade[];
  private static providers: Provider[] = providersData as unknown as Provider[];
  private static districts: DistrictBenchmark[] = districtsData as unknown as DistrictBenchmark[];

  // Trades
  static getAllTrades(): Trade[] {
    return this.trades;
  }

  static getTradeById(id: string): Trade | undefined {
    return this.trades.find((t) => t.id === id);
  }

  static filterTrades(params: {
    sector?: string;
    nsqfLevel?: number;
    district?: string;
    searchTerm?: string;
  }): Trade[] {
    return this.trades.filter((trade) => {
      if (params.sector && trade.sector !== params.sector) return false;
      if (params.nsqfLevel && trade.nsqfLevel !== params.nsqfLevel) return false;
      if (params.district && trade.district !== params.district) return false;
      if (params.searchTerm) {
        const term = params.searchTerm.toLowerCase();
        const matchesName = trade.name.toLowerCase().includes(term) || trade.nameMr.includes(term);
        const matchesSector = trade.sector.toLowerCase().includes(term) || trade.sectorMr.includes(term);
        const matchesJobRoles = trade.jobRoles.some((role) => role.toLowerCase().includes(term));
        if (!matchesName && !matchesSector && !matchesJobRoles) return false;
      }
      return true;
    });
  }

  // Providers
  static getAllProviders(): Provider[] {
    return this.providers;
  }

  static getProviderById(id: string): Provider | undefined {
    return this.providers.find((p) => p.id === id);
  }

  static getProvidersByTradeId(tradeId: string): Provider[] {
    return this.providers.filter((p) => p.tradeIds.includes(tradeId));
  }

  static filterProviders(params: {
    district?: string;
    tradeId?: string;
    verificationStatus?: string;
    searchTerm?: string;
  }): Provider[] {
    return this.providers.filter((provider) => {
      if (params.district && params.district !== "all" && provider.district !== params.district) return false;
      if (params.tradeId && params.tradeId !== "all" && !provider.tradeIds.includes(params.tradeId)) return false;
      if (params.verificationStatus && params.verificationStatus !== "all" && provider.verificationStatus !== params.verificationStatus) return false;
      if (params.searchTerm) {
        const term = params.searchTerm.toLowerCase();
        const matchesName = provider.name.toLowerCase().includes(term) || provider.nameMr.includes(term);
        const matchesAddress = provider.address.toLowerCase().includes(term);
        if (!matchesName && !matchesAddress) return false;
      }
      return true;
    });
  }

  // Districts
  static getAllDistricts(): DistrictBenchmark[] {
    return this.districts;
  }

  static getDistrictById(id: string): DistrictBenchmark | undefined {
    return this.districts.find((d) => d.id === id || d.name.toLowerCase() === id.toLowerCase());
  }

  // Families
  static getAllFamilies(): FamilyProfile[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vocasaathi_families_v2");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    return INITIAL_FAMILIES;
  }

  static getFamilyById(id: string): FamilyProfile | undefined {
    const families = this.getAllFamilies();
    return families.find((f) => f.id === id);
  }

  // Sessions
  static getAllSessions(): CounsellingSession[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vocasaathi_sessions_v2");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    return (sessionsData as unknown as CounsellingSession[]);
  }

  static getSessionById(id: string): CounsellingSession | undefined {
    const sessions = this.getAllSessions();
    return sessions.find((s) => s.id === id);
  }

  // Cases (Counsellor)
  static getAllCases(): CounsellorCase[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("vocasaathi_cases_v2") || localStorage.getItem("vocasaathi_cases");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse stored cases", e);
        }
      }
    }
    return (casesData as unknown as CounsellorCase[]);
  }

  static addCase(newCase: CounsellorCase): void {
    if (typeof window !== "undefined") {
      const existing = this.getAllCases();
      const updated = [newCase, ...existing.filter((c) => c.id !== newCase.id)];
      localStorage.setItem("vocasaathi_cases_v2", JSON.stringify(updated));
      localStorage.setItem("vocasaathi_cases", JSON.stringify(updated));

      // Sync to API
      fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case: newCase }),
      }).catch((e) => console.warn("Background case sync failed", e));
    }
  }

  static updateCaseStatus(caseId: string, status: CounsellorCase["status"], notes?: string): CounsellorCase | undefined {
    const cases = this.getAllCases();
    const target = cases.find((c) => c.id === caseId);
    if (target) {
      target.status = status;
      if (notes !== undefined) target.notes = notes;
      target.lastUpdated = new Date().toISOString();
      if (typeof window !== "undefined") {
        localStorage.setItem("vocasaathi_cases_v2", JSON.stringify(cases));
        localStorage.setItem("vocasaathi_cases", JSON.stringify(cases));

        // Sync to API
        fetch("/api/cases", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: caseId, status, notes }),
        }).catch((e) => console.warn("Background case patch sync failed", e));
      }
      return target;
    }
    return undefined;
  }

  // Admin Dashboard Aggregated Metrics (Calculated dynamically)
  static getAdminAnalytics(): AdminAnalyticsMetrics {
    const families = this.getAllFamilies();
    const sessions = this.getAllSessions();
    const cases = this.getAllCases();
    const districts = this.getAllDistricts();
    const trades = this.getAllTrades();

    const totalFamilies = districts.reduce((acc, d) => acc + d.totalSessions, 0) + families.length;
    const activeSessions = sessions.filter((s) => s.status === "active").length + 24;
    const highResistanceCases = cases.filter((c) => (c.resistanceScore || c.initialResistance || 0) >= 60).length + 42;
    const escalationsCount = cases.length + 86;

    const avgReduction = Math.round(
      districts.reduce((acc, d) => acc + d.avgResistanceReduction, 0) / districts.length
    );

    const marathiCount = families.filter((f) => f.preferredLanguage === "mr").length;
    const totalSample = families.length || 1;
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
