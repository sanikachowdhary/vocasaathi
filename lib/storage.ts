import { FamilyProfile, ChatMessage, CounsellingSession, CounsellorCase } from "./types";

export const DEFAULT_DEMO_FAMILY: FamilyProfile = {
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
};

export class SessionStorageManager {
  private static FAMILIES_KEY = "vocasaathi_families_v2";
  private static ACTIVE_FAMILY_ID_KEY = "vocasaathi_active_family_id";
  private static SESSIONS_KEY = "vocasaathi_sessions_v2";
  private static ACTIVE_SESSION_ID_KEY = "vocasaathi_active_session_id";
  private static LEGACY_PROFILE_KEY = "vocasaathi_profile";
  private static LEGACY_CHAT_KEY = "vocasaathi_chat";
  private static LEGACY_RESISTANCE_KEY = "vocasaathi_resistance";

  // --- Families Multi-Record Management ---
  static getFamilies(): FamilyProfile[] {
    if (typeof window === "undefined") {
      return [DEFAULT_DEMO_FAMILY];
    }

    const stored = localStorage.getItem(this.FAMILIES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed parsing families from localStorage", e);
      }
    }

    // Check legacy single profile key if present
    const legacy = localStorage.getItem(this.LEGACY_PROFILE_KEY);
    if (legacy) {
      try {
        const p = JSON.parse(legacy);
        const item: FamilyProfile = {
          ...p,
          id: p.id || `fam-${Date.now()}`,
          createdAt: p.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const initial = [item, DEFAULT_DEMO_FAMILY];
        localStorage.setItem(this.FAMILIES_KEY, JSON.stringify(initial));
        return initial;
      } catch (e) {}
    }

    return [DEFAULT_DEMO_FAMILY];
  }

  static getFamilyById(id: string): FamilyProfile | undefined {
    const families = this.getFamilies();
    return families.find((f) => f.id === id);
  }

  static saveFamily(profile: FamilyProfile): FamilyProfile {
    const now = new Date().toISOString();
    const id = profile.id || `fam-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const record: FamilyProfile = {
      ...profile,
      id,
      createdAt: profile.createdAt || now,
      updatedAt: now,
    };

    if (typeof window !== "undefined") {
      const families = this.getFamilies();
      const index = families.findIndex((f) => f.id === id);
      if (index >= 0) {
        families[index] = record;
      } else {
        families.unshift(record);
      }
      localStorage.setItem(this.FAMILIES_KEY, JSON.stringify(families));
      localStorage.setItem(this.ACTIVE_FAMILY_ID_KEY, id);
      localStorage.setItem(this.LEGACY_PROFILE_KEY, JSON.stringify(record));

      // Asynchronously sync with server API
      fetch("/api/families", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: record }),
      }).catch((err) => console.warn("Background family sync to server:", err));
    }

    return record;
  }

  static getProfile(): FamilyProfile {
    if (typeof window !== "undefined") {
      const activeId = localStorage.getItem(this.ACTIVE_FAMILY_ID_KEY);
      if (activeId) {
        const found = this.getFamilyById(activeId);
        if (found) return found;
      }

      const families = this.getFamilies();
      if (families.length > 0) return families[0];
    }
    return DEFAULT_DEMO_FAMILY;
  }

  static saveProfile(profile: FamilyProfile): void {
    this.saveFamily(profile);
  }

  // --- Sessions Multi-Record Management ---
  static getSessions(): CounsellingSession[] {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = localStorage.getItem(this.SESSIONS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed parsing sessions from localStorage", e);
      }
    }
    return [];
  }

  static getSessionById(id: string): CounsellingSession | undefined {
    const sessions = this.getSessions();
    return sessions.find((s) => s.id === id);
  }

  static saveSession(session: CounsellingSession): CounsellingSession {
    const now = new Date().toISOString();
    const id = session.id || `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const record: CounsellingSession = {
      ...session,
      id,
      createdAt: session.createdAt || now,
      updatedAt: now,
    };

    if (typeof window !== "undefined") {
      const sessions = this.getSessions();
      const index = sessions.findIndex((s) => s.id === id);
      if (index >= 0) {
        sessions[index] = record;
      } else {
        sessions.unshift(record);
      }
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
      localStorage.setItem(this.ACTIVE_SESSION_ID_KEY, id);
      localStorage.setItem(this.LEGACY_CHAT_KEY, JSON.stringify(record.messages));
      localStorage.setItem(this.LEGACY_RESISTANCE_KEY, record.currentResistance.toString());

      // Asynchronously sync with server API
      fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session: record }),
      }).catch((err) => console.warn("Background session sync to server:", err));
    }

    return record;
  }

  static getActiveSession(): CounsellingSession | undefined {
    if (typeof window !== "undefined") {
      const activeId = localStorage.getItem(this.ACTIVE_SESSION_ID_KEY);
      if (activeId) {
        return this.getSessionById(activeId);
      }
      const sessions = this.getSessions();
      if (sessions.length > 0) {
        return sessions[0];
      }
    }
    return undefined;
  }

  static saveChatMessages(messages: ChatMessage[], currentResistance = 72): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.LEGACY_CHAT_KEY, JSON.stringify(messages));
      
      const activeFamily = this.getProfile();
      const activeSession = this.getActiveSession();
      const sessionId = activeSession?.id || `sess-${Date.now()}`;

      const sessionRecord: CounsellingSession = {
        id: sessionId,
        familyId: activeFamily.id,
        profile: activeFamily,
        initialResistance: activeSession?.initialResistance || 72,
        currentResistance: currentResistance,
        objectionsDetected: activeSession?.objectionsDetected || ["income"],
        tradesDiscussed: activeSession?.tradesDiscussed || ["trade-electrician"],
        messages: messages,
        status: "active",
        createdAt: activeSession?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.saveSession(sessionRecord);
    }
  }

  static getChatMessages(): ChatMessage[] {
    if (typeof window !== "undefined") {
      const activeSession = this.getActiveSession();
      if (activeSession && activeSession.messages && activeSession.messages.length > 0) {
        return activeSession.messages;
      }

      const stored = localStorage.getItem(this.LEGACY_CHAT_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed parsing chat messages", e);
        }
      }
    }
    return [];
  }

  static saveResistance(score: number): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.LEGACY_RESISTANCE_KEY, score.toString());
      const activeSession = this.getActiveSession();
      if (activeSession) {
        activeSession.currentResistance = score;
        this.saveSession(activeSession);
      }
    }
  }

  static getResistance(): number {
    if (typeof window !== "undefined") {
      const activeSession = this.getActiveSession();
      if (activeSession && typeof activeSession.currentResistance === "number") {
        return activeSession.currentResistance;
      }

      const stored = localStorage.getItem(this.LEGACY_RESISTANCE_KEY);
      if (stored) {
        return parseInt(stored, 10);
      }
    }
    return 72; // Default starting high resistance
  }

  static resetSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.LEGACY_CHAT_KEY);
      localStorage.removeItem(this.LEGACY_RESISTANCE_KEY);
      localStorage.removeItem(this.ACTIVE_SESSION_ID_KEY);
    }
  }
}
