import { DataProvider } from "@/lib/data/dataProvider";
import { Trade, Provider, FamilyProfile, ObjectionCategory } from "@/lib/types";

export interface RetrievedEvidence {
  trades: Trade[];
  providers: Provider[];
  primaryTrade?: Trade;
  keyMetrics: {
    placementRate: number;
    medianEarnings: number;
    nsqfLevel: number;
    experienceEarnings: string;
  };
  contextNote: string;
}

export function retrieveEvidence(
  query: string,
  profile: FamilyProfile,
  objection: ObjectionCategory
): RetrievedEvidence {
  const allTrades = DataProvider.getAllTrades();
  const allProviders = DataProvider.getAllProviders();

  // 1. Identify trade based on interest and explicit query keywords
  const q = query.toLowerCase();
  let matchedTrade: Trade | undefined;

  if (q.includes("solar") || q.includes("सोलर") || q.includes("green energy") || profile.primaryInterest.toLowerCase().includes("solar")) {
    matchedTrade = allTrades.find((t) => t.id === "trade-solar-pv");
  } else if (q.includes("health") || q.includes("hospital") || q.includes("रुग्ण") || q.includes("आरोग्य") || profile.primaryInterest.toLowerCase().includes("health")) {
    matchedTrade = allTrades.find((t) => t.id === "trade-healthcare-assistant");
  } else if (q.includes("cnc") || q.includes("machine") || q.includes("मशीन") || profile.primaryInterest.toLowerCase().includes("cnc") || profile.primaryInterest.toLowerCase().includes("manufacturing")) {
    matchedTrade = allTrades.find((t) => t.id === "trade-cnc-machining");
  } else if (q.includes("car") || q.includes("auto") || q.includes("गाडी") || q.includes("ev") || profile.primaryInterest.toLowerCase().includes("auto")) {
    matchedTrade = allTrades.find((t) => t.id === "trade-auto-ev");
  } else if (q.includes("it") || q.includes("computer") || q.includes("कॉम्प्युटर") || q.includes("cloud") || profile.primaryInterest.toLowerCase().includes("it")) {
    matchedTrade = allTrades.find((t) => t.id === "trade-it-support");
  } else if (q.includes("retail") || q.includes("mall") || q.includes("dmart") || q.includes("माल") || profile.primaryInterest.toLowerCase().includes("retail")) {
    matchedTrade = allTrades.find((t) => t.id === "trade-retail-logistics");
  } else if (q.includes("beauty") || q.includes("salon") || q.includes("पार्लर") || profile.primaryInterest.toLowerCase().includes("beauty")) {
    matchedTrade = allTrades.find((t) => t.id === "trade-beauty-wellness");
  } else if (q.includes("food") || q.includes("bakery") || q.includes("अन्न") || profile.primaryInterest.toLowerCase().includes("food")) {
    matchedTrade = allTrades.find((t) => t.id === "trade-food-production");
  } else if (q.includes("civil") || q.includes("construction") || q.includes("बांधकाम") || profile.primaryInterest.toLowerCase().includes("construction")) {
    matchedTrade = allTrades.find((t) => t.id === "trade-construction-infra");
  }

  // Default fallback to Electrician if nothing explicit
  if (!matchedTrade) {
    matchedTrade = allTrades.find((t) => t.id === "trade-electrician") || allTrades[0];
  }

  // Also include secondary related trade (e.g. Solar alongside Electrician)
  const secondaryTradeId = matchedTrade.id === "trade-electrician" ? "trade-solar-pv" : "trade-electrician";
  const secondaryTrade = allTrades.find((t) => t.id === secondaryTradeId);

  const tradesToReturn = secondaryTrade ? [matchedTrade, secondaryTrade] : [matchedTrade];

  // Retrieve relevant providers (e.g. in Pune or matching district)
  const relevantProviders = allProviders.filter(
    (p) => p.tradeIds.includes(matchedTrade!.id) && (p.district.toLowerCase() === profile.locationDistrict.toLowerCase() || p.district === "Pune")
  );

  return {
    trades: tradesToReturn,
    providers: relevantProviders.slice(0, 3),
    primaryTrade: matchedTrade,
    keyMetrics: {
      placementRate: matchedTrade.placementRate,
      medianEarnings: matchedTrade.medianEarnings,
      nsqfLevel: matchedTrade.nsqfLevel,
      experienceEarnings: matchedTrade.experienceEarnings,
    },
    contextNote: `Evidence anchored to ${profile.locationDistrict} district vocational outcome dataset (2025–26).`,
  };
}
