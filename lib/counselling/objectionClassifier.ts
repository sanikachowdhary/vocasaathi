import { ObjectionCategory } from "@/lib/types";

export function classifyObjection(query: string): ObjectionCategory {
  const q = query.toLowerCase();

  // Social Status & Degree Comparison
  if (
    q.includes("degree") ||
    q.includes("डिग्री") ||
    q.includes("status") ||
    q.includes("प्रतिष्ठा") ||
    q.includes("stigma") ||
    q.includes("respect") ||
    q.includes("मान") ||
    q.includes("b.sc") ||
    q.includes("b.a") ||
    q.includes("b.com") ||
    q.includes("engineer") ||
    q.includes("better") ||
    q.includes("बरी") ||
    q.includes("समाज") ||
    q.includes("नातेवाईक")
  ) {
    return "social_status";
  }

  // Income / Salary
  if (
    q.includes("salary") ||
    q.includes("पगार") ||
    q.includes("income") ||
    q.includes("कमाई") ||
    q.includes("पैसा") ||
    q.includes("earnings") ||
    q.includes("stipend") ||
    q.includes("पैसे") ||
    q.includes("वाढेल का")
  ) {
    return "income";
  }

  // Higher education & Lateral Entry
  if (
    q.includes("study") ||
    q.includes("पुढे") ||
    q.includes("शिकू") ||
    q.includes("diploma") ||
    q.includes("डिप्लोमा") ||
    q.includes("bvoc") ||
    q.includes("higher") ||
    q.includes("lateral") ||
    q.includes("शिकायला") ||
    q.includes("शिक्षण")
  ) {
    return "higher_education";
  }

  // Workplace Safety & Environment
  if (
    q.includes("safe") ||
    q.includes("सुरक्षित") ||
    q.includes("धोका") ||
    q.includes("risk") ||
    q.includes("accident") ||
    q.includes("electric shock") ||
    q.includes("अपघात") ||
    q.includes("women") ||
    q.includes("मुलींसाठी")
  ) {
    return "safety";
  }

  // Job Security & Placement
  if (
    q.includes("job") ||
    q.includes("नोकरी") ||
    q.includes("placement") ||
    q.includes("कंपनी") ||
    q.includes("security") ||
    q.includes("शाश्वती") ||
    q.includes("मिळेल का") ||
    q.includes("recruit")
  ) {
    return "job_security";
  }

  // Career Growth / Ceiling
  if (
    q.includes("growth") ||
    q.includes("प्रगती") ||
    q.includes("future") ||
    q.includes("भविष्य") ||
    q.includes("supervisor") ||
    q.includes("manager") ||
    q.includes("पदोन्नती") ||
    q.includes("promotion")
  ) {
    return "career_growth";
  }

  // Location / Proximity
  if (
    q.includes("pune") ||
    q.includes("पुणे") ||
    q.includes("nashik") ||
    q.includes("नाशिक") ||
    q.includes("near") ||
    q.includes("जवळ") ||
    q.includes("बाहेर") ||
    q.includes("गावाकडे") ||
    q.includes("hostel") ||
    q.includes("वस्तीगृह")
  ) {
    return "location";
  }

  // Course Quality
  if (
    q.includes("quality") ||
    q.includes("दर्जा") ||
    q.includes("teacher") ||
    q.includes("lab") ||
    q.includes("equipment") ||
    q.includes("मान्यता")
  ) {
    return "course_quality";
  }

  return "job_security";
}
