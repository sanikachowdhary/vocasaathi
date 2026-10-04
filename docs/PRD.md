# VocaSaathi — Product Requirements Document (PRD)

> **Tagline:** Helping families choose skills with confidence.  
> **Core Thesis:** Most career-guidance platforms talk exclusively to the learner. **VocaSaathi talks to the family.**

---

## 1. Problem Statement
In India, career and vocational education choices are fundamentally **collective family decisions**, especially among lower-middle-class, rural, and semi-urban households. 

While young learners may show interest in vocational trades (ITIs, short-term skilling, polytechnics), parents often display deep hesitation and resistance rooted in:
1. **Income Uncertainty:** Will this trade provide a dependable, sustainable livelihood?
2. **Job Security & Local Availability:** Are there real formal jobs nearby (e.g., in Pune, Nashik, Nagpur)?
3. **Social Perception & Status Stigma:** Is vocational skilling respected in the community compared to general degrees (BA/BSc/BCom)?
4. **Higher Education Dead-ends:** Will choosing a vocational track prevent future academic progression or degrees?
5. **Career Ceiling / Stagnation:** Will the child be stuck in entry-level blue-collar labor forever?
6. **Workplace Safety & Inclusivity:** Are working conditions safe and supportive?

Generic career bots fail because they provide abstract, generic advice ("Follow your passion") instead of **addressing parental risk-aversion with verified evidence**.

---

## 2. Target Users & Personas
- **The Learner (Age 16–22):** 10th/12th pass looking for practical skill courses, job readiness, and economic independence.
- **The Parent / Family Decision Maker:** Risk-averse, highly invested in child's safety and long-term security, influenced by societal status expectations.
- **The Human Counsellor:** Vocational skilling counsellors who need pre-analyzed case summaries, resistance trajectories, and detected family objections before conducting 1-on-1 calls.
- **The Scheme Administrator (SIH/MSDE/State Skilling Missions):** Policy planners needing real-time aggregated insights into where parental resistance is concentrated by district and trade.

---

## 3. Product Solution Overview
VocaSaathi provides an **evidence-first, bilingual (English + Marathi) AI counselling companion** that mediates family conversations. 

### Key Innovations:
1. **Family-Centric Context Onboarding:** Captures dual perspectives (learner aspirations + parental anxieties).
2. **Evidence-First Retrieval Layer:** Quantitative answers (placement rate, median earnings, NSQF level, local providers) are anchored strictly to seeded datasets labeled `Illustrative Hackathon Dataset`.
3. **Parent Objection Classifier:** Maps queries into 10 distinct psychological resistance categories.
4. **Dynamic Resistance Scoring (0–100):** Measures resistance reduction across the counselling lifecycle (e.g., 72 → 41).
5. **Human Escalation Engine:** Automatically recognizes when evidence is insufficient or resistance remains high, opening a structured case ticket with full transcript and context for human counsellors.
6. **Administrator Insights Dashboard:** Calculates district-level resistance heatmaps, trade demand vs. parental hesitation, and escalation metrics.
7. **Accessibility & Low-Literacy Support:** Marathi natural phrasing, high-contrast UI, large touch targets, visual career pathways, and web speech synthesis (`🔊 Listen`).

---

## 4. SIH Compliance & Evaluation Criteria
- **Demo Mode Independence:** 100% operational locally with deterministic intelligence, without requiring paid API keys or active internet connections.
- **Ethical AI Boundaries:** Zero hallucination of fake government statistics; clear visual disclaimer badges.
- **Full End-to-End User Journey:** Complete flow from Landing → Onboarding → AI Counselling → Evidence Cards → Career Pathway → Trade Comparison → Counsellor Escalation → Admin Analytics.
