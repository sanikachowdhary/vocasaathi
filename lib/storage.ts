import { FamilyProfile, ChatMessage, CounsellorCase } from "./types";

export const DEFAULT_DEMO_FAMILY: FamilyProfile = {
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
};

export class SessionStorageManager {
  private static PROFILE_KEY = "vocasaathi_profile";
  private static CHAT_KEY = "vocasaathi_chat";
  private static RESISTANCE_KEY = "vocasaathi_resistance";

  static saveProfile(profile: FamilyProfile): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
    }
  }

  static getProfile(): FamilyProfile {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.PROFILE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed parsing profile", e);
        }
      }
    }
    return DEFAULT_DEMO_FAMILY;
  }

  static saveChatMessages(messages: ChatMessage[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.CHAT_KEY, JSON.stringify(messages));
    }
  }

  static getChatMessages(): ChatMessage[] {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.CHAT_KEY);
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
      localStorage.setItem(this.RESISTANCE_KEY, score.toString());
    }
  }

  static getResistance(): number {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.RESISTANCE_KEY);
      if (stored) {
        return parseInt(stored, 10);
      }
    }
    return 72; // Default starting high resistance for demo
  }

  static resetSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.CHAT_KEY);
      localStorage.removeItem(this.RESISTANCE_KEY);
    }
  }
}
