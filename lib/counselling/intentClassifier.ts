export type IntentType = 
  | "ask_income"
  | "ask_degree_comparison"
  | "ask_higher_education"
  | "ask_job_security"
  | "ask_safety"
  | "ask_career_growth"
  | "ask_location"
  | "ask_course_duration"
  | "ask_provider"
  | "request_counsellor"
  | "general_inquiry";

export function classifyIntent(query: string): IntentType {
  const q = query.toLowerCase();

  // Counsellor escalation intent
  if (
    q.includes("counsellor") ||
    q.includes("counselor") ||
    q.includes("human") ||
    q.includes("call") ||
    q.includes("phone") ||
    q.includes("समुपदेशक") ||
    q.includes("फोन") ||
    q.includes("बोलायचे") ||
    q.includes("मदत") ||
    q.includes("contact")
  ) {
    return "request_counsellor";
  }

  // Degree vs ITI / Vocational comparison
  if (
    q.includes("degree") ||
    q.includes("डिग्री") ||
    q.includes("ba") ||
    q.includes("bsc") ||
    q.includes("bcom") ||
    q.includes("college") ||
    q.includes("कॉलेज") ||
    q.includes("better nahi") ||
    q.includes("बरी नाही का") ||
    q.includes("प्रतिष्ठा") ||
    q.includes("stigma") ||
    q.includes("status") ||
    q.includes("मान")
  ) {
    return "ask_degree_comparison";
  }

  // Higher education & progression
  if (
    q.includes("further") ||
    q.includes("पुढे") ||
    q.includes("शिकू") ||
    q.includes("study") ||
    q.includes("diploma") ||
    q.includes("डिप्लोमा") ||
    q.includes("b.voc") ||
    q.includes("bvoc") ||
    q.includes("higher") ||
    q.includes("lateral") ||
    q.includes("शिकायला")
  ) {
    return "ask_higher_education";
  }

  // Income / Salary / Earnings
  if (
    q.includes("salary") ||
    q.includes("पगार") ||
    q.includes("कमाई") ||
    q.includes("income") ||
    q.includes("earning") ||
    q.includes("kitna milega") ||
    q.includes("पैसा") ||
    q.includes("stipend") ||
    q.includes("पैशांची") ||
    q.includes("वेतन")
  ) {
    return "ask_income";
  }

  // Job security / Placement / Availability
  if (
    q.includes("job") ||
    q.includes("नोकरी") ||
    q.includes("काम") ||
    q.includes("placement") ||
    q.includes("security") ||
    q.includes("हक्काची") ||
    q.includes("milegi kya") ||
    q.includes("लागेल का") ||
    q.includes("demand") ||
    q.includes("भविष्य") ||
    q.includes("future")
  ) {
    return "ask_job_security";
  }

  // Safety & Working conditions
  if (
    q.includes("safe") ||
    q.includes("सुरक्षित") ||
    q.includes("धोका") ||
    q.includes("danger") ||
    q.includes("risk") ||
    q.includes("accident") ||
    q.includes("health") ||
    q.includes("महिला") ||
    q.includes("female")
  ) {
    return "ask_safety";
  }

  // Career growth / Managerial ceiling
  if (
    q.includes("growth") ||
    q.includes("प्रगती") ||
    q.includes("supervisor") ||
    q.includes("manager") ||
    q.includes("वाढ") ||
    q.includes("promotion") ||
    q.includes("ceiling") ||
    q.includes("पुढे काय")
  ) {
    return "ask_career_growth";
  }

  // Location / District
  if (
    q.includes("pune") ||
    q.includes("पुणे") ||
    q.includes("nashik") ||
    q.includes("नाशिक") ||
    q.includes("nagpur") ||
    q.includes("near") ||
    q.includes("जवळ") ||
    q.includes("location") ||
    q.includes("गाव") ||
    q.includes("district")
  ) {
    return "ask_location";
  }

  // Provider / Institute
  if (
    q.includes("iti") ||
    q.includes("college") ||
    q.includes("institute") ||
    q.includes("संस्था") ||
    q.includes("शाळा") ||
    q.includes("center") ||
    q.includes("केंद्र") ||
    q.includes("admissions") ||
    q.includes("प्रवेश")
  ) {
    return "ask_provider";
  }

  return "general_inquiry";
}
