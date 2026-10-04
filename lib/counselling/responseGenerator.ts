import { FamilyProfile, ObjectionCategory, Trade, Provider } from "@/lib/types";
import { RetrievedEvidence } from "./evidenceRetriever";

export interface StructuredAIResponse {
  message: string;
  concern: ObjectionCategory;
  evidence: Trade[];
  recommendedActions: Array<{
    label: string;
    labelMr: string;
    actionType: "ask_question" | "view_trade" | "compare" | "talk_counsellor" | "view_pathway";
    payload?: string;
  }>;
  resistanceScore: number;
  escalationRecommended: boolean;
  explanation: string;
}

export function generateStructuredResponse(params: {
  query: string;
  profile: FamilyProfile;
  objection: ObjectionCategory;
  evidence: RetrievedEvidence;
  newResistanceScore: number;
  shouldEscalate: boolean;
  language: "en" | "mr";
}): StructuredAIResponse {
  const { query, profile, objection, evidence, newResistanceScore, shouldEscalate, language } = params;
  const trade = evidence.primaryTrade!;
  const q = query.toLowerCase();

  let message = "";
  const recommendedActions: StructuredAIResponse["recommendedActions"] = [];

  if (language === "mr") {
    // MARATHI RESPONSES
    if (objection === "social_status" || q.includes("degree") || q.includes("डिग्री")) {
      message = `**१. स्वागत व समजून घेणे:** पालक म्हणून पारंपरिक पदवी (B.Sc / B.A) आणि आयटीआय/कौशल्य शिक्षणाची तुलना करणे अत्यंत स्वाभाविक आहे.\n\n` +
        `**२. स्पष्ट उत्तर:** पदवी आणि कौशल्य शिक्षण हे दोन्ही वेगळ्या उद्दिष्टांसाठी आहेत. कौशल्याचा मार्ग कमी खर्चात आणि अवघ्या १ ते २ वर्षांत प्रत्यक्ष नोकरी किंवा कमाईची संधी देतो.\n\n` +
        `**३. वस्तुनिष्ठ पुरावा (डेटा):** ${trade.nameMr} या कोर्सचा स्थानिक प्लेसमेंट दर **${trade.placementRate}%** आहे. सुरुवातीचा सरासरी पगार **₹${trade.medianEarnings.toLocaleString('en-IN')} ते ₹${trade.earningsHigh.toLocaleString('en-IN')}/महिना** आहे. हा कोर्स **NSQF स्तर ${trade.nsqfLevel}** प्रमाणित आहे.\n\n` +
        `**४. तुमच्या कुटुंबासाठी महत्त्व:** ${profile.learnerName ? profile.learnerName : 'तुमच्या पाल्याच्या'} १२वी नंतर ३-४ वर्षे डिग्रीवर खर्च करण्याऐवजी, ते १-२ वर्षांत आर्थिकदृष्ट्या स्वावलंबी होऊ शकतात आणि नंतर नोकरी करत 'B.Voc' किंवा 'थेट पदविका (Polytechnic Lateral Entry)' पदवी पूर्ण करू शकतात.\n\n` +
        `**५. पुढील पाऊल:** पदवी आणि या कोर्सच्या करिअर मार्गाची तुलना पाहूया किंवा जवळचे सरकारी कॉलेज तपासूया.`;
    } else if (objection === "higher_education" || q.includes("पुढे") || q.includes("शिकू")) {
      message = `**१. स्वागत व समजून घेणे:** "पुढे शिकता येईल का?" ही पालकांची सर्वात रास्त आणि महत्त्वाची शंका असते.\n\n` +
        `**२. स्पष्ट उत्तर:** होय! व्होकेशनल कोर्स पूर्ण केल्यावर शिक्षणाचे दरवाजे बंद होत नाहीत, उलट तांत्रिक शिक्षणात थेट दुसऱ्या वर्षाला प्रवेश मिळतो.\n\n` +
        `**३. वस्तुनिष्ठ पुरावा (डेटा):** राष्ट्रीय कौशल्य पात्रता (NSQF Level 4) पूर्ण केल्यावर विद्यार्थी **थेट शासकीय पॉलिटेक्निक पदविकेच्या दुसऱ्या वर्षात (Direct 2nd Year Lateral Entry)** प्रवेश घेऊ शकतात. तसेच UGC मान्यताप्राप्त **B.Voc (Bachelor of Vocation)** पदवी पूर्ण करू शकतात.\n\n` +
        `**४. तुमच्या कुटुंबासाठी महत्त्व:** ${profile.locationDistrict} परिसरातील शासकीय तंत्रनिकेतनमध्ये यासाठी राखीव जागा असतात. यामुळे ३ वर्षांचा डिप्लोमा २ वर्षांत पूर्ण करता येतो.\n\n` +
        `**५. पुढील पाऊल:** खालील 'करिअर प्रगतीचा नकाशा' पहा, ज्यामध्ये शिकाऊ उमेदवारापासून इंजिनिअर/पर्यवेक्षक बनण्याचे टप्पे दाखवले आहेत.`;
    } else if (objection === "safety" || q.includes("safe") || q.includes("सुरक्षित")) {
      message = `**१. स्वागत व समजून घेणे:** कामाच्या ठिकाणच्या सुरक्षिततेविषयी पालकांची काळजी अत्यंत स्वाभाविक आहे.\n\n` +
        `**२. स्पष्ट उत्तर:** आधुनिक औद्योगिक युनिट्स आणि प्रशिक्षण केंद्रांमध्ये सुरक्षिततेचे आंतरराष्ट्रीय निकष काटेकोरपणे पाळले जातात.\n\n` +
        `**३. वस्तुनिष्ठ पुरावा (डेटा):** ${trade.safetyInfoMr}\n\n` +
        `**४. तुमच्या कुटुंबासाठी महत्त्व:** प्रशिक्षण कालावधीतच सर्व सुरक्षा उपकरणांचा (PPE Kits, LOTO सिस्टिम) सराव करून घेतला जातो, ज्यामुळे अपघात होण्याची शक्यता नगण्य असते.\n\n` +
        `**५. पुढील पाऊल:** प्रशिक्षण देणाऱ्या स्थानिक संस्थांची पाहणी करूया.`;
    } else {
      // Income / Placement / General
      message = `**१. स्वागत व समजून घेणे:** नवीन क्षेत्र निवडताना "चांगली नोकरी व पगार मिळेल का?" हा पालकांच्या मनातील प्रमुख प्रश्न असतो.\n\n` +
        `**२. स्पष्ट उत्तर:** ${trade.nameMr} या क्षेत्रात ${profile.locationDistrict} आणि महाराष्ट्रातील औद्योगिक पट्ट्यात कुशल उमेदवारांची सतत मोठी मागणी आहे.\n\n` +
        `**३. वस्तुनिष्ठ पुरावा (डेटा):** आमचा डेटा दाखवतो की या ट्रेडमध्ये **${trade.placementRate}% प्लेसमेंट दर** आहे. सुरुवातीला दरमहा **₹${trade.earningsLow.toLocaleString('en-IN')} ते ₹${trade.earningsHigh.toLocaleString('en-IN')}** वेतन मिळते, आणि ३-४ वर्षांच्या अनुभवानंतर **${trade.experienceEarnings}** पर्यंत पगार वाढतो.\n\n` +
        `**४. तुमच्या कुटुंबासाठी महत्त्व:** ${profile.incomeBracket} उत्पन्न गटातील कुटुंबासाठी २ वर्षांच्या आत स्थिर उत्पन्न मिळवून देणारा हा एक अतिशय सुरक्षित पर्याय आहे.\n\n` +
        `**५. पुढील पाऊल:** या कोर्सच्या नोकऱ्यांचे स्वरूप पहा किंवा इतर कोर्सेसशी तुलना करा.`;
    }

    recommendedActions.push(
      { label: "करिअर प्रगतीचा नकाशा पहा", labelMr: "करिअर प्रगतीचा नकाशा पहा", actionType: "view_pathway" },
      { label: "इतर कोर्सेसशी तुलना करा", labelMr: "इतर कोर्सेसशी तुलना करा", actionType: "compare" },
      { label: "तज्ज्ञ समुपदेशकांशी बोला", labelMr: "तज्ज्ञ समुपदेशकांशी बोला", actionType: "talk_counsellor" }
    );
  } else {
    // ENGLISH RESPONSES
    if (objection === "social_status" || q.includes("degree") || q.includes("b.sc")) {
      message = `**1. Acknowledge:** That is a very natural and valid question for any parent comparing a 3-year traditional college degree (B.Sc/B.Com) with vocational skilling.\n\n` +
        `**2. Direct Answer:** A degree and vocational training serve different career timelines. Vocational skilling prioritizes quick employability, practical hands-on capability, and zero college debt within 1–2 years.\n\n` +
        `**3. Evidence Breakdown:** For **${trade.name}**, empirical data indicates an **${trade.placementRate}% placement rate**, with entry median earnings of **₹${trade.medianEarnings.toLocaleString('en-IN')}/month** (range: ₹${trade.earningsLow.toLocaleString('en-IN')} – ₹${trade.earningsHigh.toLocaleString('en-IN')}). It is certified under **NSQF Level ${trade.nsqfLevel}**.\n\n` +
        `**4. Family Context:** For ${profile.learnerName || 'your learner'} in ${profile.locationDistrict}, starting with this credential allows financial independence by age 20, while keeping lateral pathways to a formal B.Voc degree or Polytechnic Diploma wide open.\n\n` +
        `**5. Next Step:** Let us compare this trade with other technical pathways or inspect nearby accredited training providers.`;
    } else if (objection === "higher_education" || q.includes("further") || q.includes("study") || q.includes("lateral")) {
      message = `**1. Acknowledge:** Many families worry that choosing an ITI or vocational course creates an educational dead-end.\n\n` +
        `**2. Direct Answer:** That is a myth under the National Skills Qualifications Framework (NSQF). Vocational qualifications offer structured vertical progression into formal degrees and diplomas.\n\n` +
        `**3. Evidence Breakdown:** Upon completing this Level 4 course, candidates qualify for **Direct 2nd Year Lateral Entry to Polytechnic Engineering Diplomas** and UGC-recognized **B.Voc (Bachelor of Vocation)** degrees without starting from year one.\n\n` +
        `**4. Family Context:** State institutions in ${profile.locationDistrict} reserve specific quota seats for certified vocational pass-outs, enabling your child to earn while studying.\n\n` +
        `**5. Next Step:** Review the interactive career pathway ladder below to see supervisory and managerial promotion stages.`;
    } else if (objection === "safety" || q.includes("safe")) {
      message = `**1. Acknowledge:** Ensuring your child works in a safe and supportive workplace is the primary duty of every family.\n\n` +
        `**2. Direct Answer:** Modern vocational training strictly follows regulated industrial safety norms and standard operating procedures.\n\n` +
        `**3. Evidence Breakdown:** ${trade.safetyInfo}\n\n` +
        `**4. Family Context:** In ${profile.locationDistrict}'s industrial belts, certified safety gear (PPE) and strict Lock-Out Tag-Out (LOTO) protocols are mandated by state labor inspectors.\n\n` +
        `**5. Next Step:** Check verified training institutes in your district that have certified laboratory safety gear.`;
    } else {
      // Income & General
      message = `**1. Acknowledge:** Earning potential and job stability are understandably the top priority for your family.\n\n` +
        `**2. Direct Answer:** **${trade.name}** offers strong, immediate employment prospects across Maharashtra's manufacturing and infrastructure sectors.\n\n` +
        `**3. Evidence Breakdown:** The verified placement rate is **${trade.placementRate}%**, with starting salaries of **₹${trade.earningsLow.toLocaleString('en-IN')} – ₹${trade.earningsHigh.toLocaleString('en-IN')}/month**. Experienced technicians earn **${trade.experienceEarnings}**.\n\n` +
        `**4. Family Context:** For a household in ${profile.locationDistrict} aiming for dependable growth within the ${profile.incomeBracket} bracket, this provides a fast track to steady earnings.\n\n` +
        `**5. Next Step:** Would you like to compare this course with Solar Energy or speak directly with a career counsellor?`;
    }

    recommendedActions.push(
      { label: "View Career Pathway", labelMr: "करिअर प्रगतीचा नकाशा पहा", actionType: "view_pathway" },
      { label: "Compare with Other Trades", labelMr: "इतर कोर्सेसशी तुलना करा", actionType: "compare" },
      { label: "Talk to a Counsellor", labelMr: "तज्ज्ञ समुपदेशकांशी बोला", actionType: "talk_counsellor" }
    );
  }

  return {
    message,
    concern: objection,
    evidence: evidence.trades,
    recommendedActions,
    resistanceScore: newResistanceScore,
    escalationRecommended: shouldEscalate,
    explanation: `Evidence retrieved for ${trade.name} (${trade.placementRate}% placement, ₹${trade.medianEarnings} median).`,
  };
}
