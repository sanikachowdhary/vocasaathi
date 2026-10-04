# VocaSaathi — Data Model Specification

## 1. Entity Relationships

```mermaid
erDiagram
    TRADE ||--o{ PROVIDER : "offered_by"
    DISTRICT ||--o{ PROVIDER : "located_in"
    DISTRICT ||--o{ SESSION : "conducted_in"
    TRADE ||--o{ SESSION : "discussed_in"
    SESSION ||--o| COUNSELLOR_CASE : "escalates_to"
    
    TRADE {
        string id PK
        string name
        string nameMr
        string sector
        string sectorMr
        number nsqfLevel
        string duration
        string entryEducation
        number placementRate
        number medianEarnings
        number earningsLow
        number earningsHigh
        string experienceEarnings
        array jobRoles
        array progression
        array higherEducationOptions
        string demandIndicator
        string safetyInfo
        string genderInclusivity
        string state
        string district
        array providerIds FK
        string source
        string dataPeriod
        string verificationStatus
    }

    PROVIDER {
        string id PK
        string name
        string nameMr
        string state
        string district
        string address
        array tradeIds FK
        number placementRate
        number completionRate
        string contactPhone
        string contactEmail
        string verificationStatus
        string lastUpdated
    }

    DISTRICT {
        string id PK
        string name
        string nameMr
        string state
        number totalSessions
        number avgInitialResistance
        number avgFinalResistance
        number escalationRate
        string topConcern
        array topTrades
    }

    SESSION {
        string id PK
        string learnerName
        number learnerAge
        string education
        string district
        string state
        string incomeBracket
        string primaryInterest
        string primaryConcern
        string language
        number initialResistance
        number currentResistance
        array objectionsDetected
        array tradesDiscussed
        string status
        string createdAt
        string updatedAt
    }

    COUNSELLOR_CASE {
        string id PK
        string sessionId FK
        string familyName
        string contactNumber
        string preferredLanguage
        string preferredContactTime
        string priority
        string status
        string primaryConcern
        number resistanceScore
        string summary
        array detectedObjections
        array evidenceShown
        array recommendedActions
        string notes
        string createdAt
    }
```

---

## 2. Integrity Rules
1. Every `providerIds` entry in `trades.json` corresponds to a valid `id` in `providers.json`.
2. Every `district` in `trades.json`, `providers.json`, `sessions.json`, and `cases.json` corresponds to a valid district entry in `districts.json`.
3. All salary, placement, and completion numbers are internally consistent and labeled as `Illustrative Hackathon Dataset`.
