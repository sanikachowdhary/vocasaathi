import { ResistanceBand, ObjectionCategory } from "@/lib/types";

export interface ResistanceEvaluation {
  score: number;
  band: ResistanceBand;
  bandLabel: string;
  bandLabelMr: string;
  delta: number;
  explanation: string;
  explanationMr: string;
}

export function getResistanceBand(score: number): { band: ResistanceBand; bandLabel: string; bandLabelMr: string } {
  if (score <= 24) {
    return { band: "low", bandLabel: "Low Resistance (Confident)", bandLabelMr: "कमी चिंता (आत्मविश्वास वाढला)" };
  }
  if (score <= 49) {
    return { band: "moderate", bandLabel: "Moderate Resistance (Receptive)", bandLabelMr: "मध्यम चिंता (मार्ग मोकळा)" };
  }
  if (score <= 74) {
    return { band: "high", bandLabel: "High Resistance (Skeptical)", bandLabelMr: "जास्त चिंता (शंकांचे सावट)" };
  }
  return { band: "very_high", bandLabel: "Very High Resistance (Hesitant)", bandLabelMr: "अतिशय तीव्र चिंता (तज्ज्ञांची गरज)" };
}

export function calculateUpdatedResistance(
  currentScore: number,
  objection: ObjectionCategory,
  userMessage: string,
  turnCount: number
): ResistanceEvaluation {
  let scoreDelta = 0;
  const q = userMessage.toLowerCase();

  // Positive signals (acknowledgement, comparing options, asking for colleges)
  if (
    q.includes("okay") ||
    q.includes("samajhla") ||
    q.includes("समजले") ||
    q.includes("barobar") ||
    q.includes("बरोबर") ||
    q.includes("chaan") ||
    q.includes("छान") ||
    q.includes("pathway") ||
    q.includes("admission") ||
    q.includes("कॉलेज कुठे आहे")
  ) {
    scoreDelta -= 15;
  } else if (q.includes("degree") || q.includes("डिग्री") || q.includes("प्रतिष्ठा")) {
    // Degree comparison handled with evidence usually reduces resistance
    scoreDelta -= 12;
  } else if (q.includes("salary") || q.includes("पगार") || q.includes("income")) {
    // Clear salary benchmark reduces resistance
    scoreDelta -= 14;
  } else if (q.includes("पुढे") || q.includes("further") || q.includes("lateral")) {
    // Higher education pathway reduces dead-end fear
    scoreDelta -= 16;
  } else if (q.includes("safe") || q.includes("सुरक्षित")) {
    scoreDelta -= 10;
  } else {
    // Generic progression with evidence
    scoreDelta -= 8;
  }

  // If user expresses repeated frustration or repeated doubts, increase slightly
  if (q.includes("pan tari") || q.includes("पण तरी") || q.includes("not satisfied") || q.includes("विश्वास नाही")) {
    scoreDelta += 18;
  }

  // Calculate new bounded score (0 to 100)
  const newScore = Math.max(15, Math.min(95, currentScore + scoreDelta));
  const actualDelta = newScore - currentScore;
  const bandInfo = getResistanceBand(newScore);

  let explanation = `Resistance dropped by ${Math.abs(actualDelta)} points as verified outcome evidence was reviewed.`;
  let explanationMr = `प्रमाणित वेतन आणि करिअर मार्गाचा पुरावा पाहिल्यामुळे पालकांची चिंता ${Math.abs(actualDelta)} अंकांनी कमी झाली.`;

  if (actualDelta >= 0) {
    explanation = "Deep-rooted family apprehension remains high; human counselling recommended.";
    explanationMr = "पालकांच्या मनात अजूनही तीव्र शंका आहेत; तज्ज्ञ समुपदेशकांशी प्रत्यक्ष चर्चा फायदेशीर ठरेल.";
  }

  return {
    score: newScore,
    band: bandInfo.band,
    bandLabel: bandInfo.bandLabel,
    bandLabelMr: bandInfo.bandLabelMr,
    delta: actualDelta,
    explanation,
    explanationMr,
  };
}
