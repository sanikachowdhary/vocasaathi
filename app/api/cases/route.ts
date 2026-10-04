import { NextRequest, NextResponse } from "next/server";
import { PersistentStore } from "@/lib/data/persistentStore";
import { CounsellorCase } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const caseItem = PersistentStore.getCaseById(id);
      if (!caseItem) {
        return NextResponse.json({ error: "Case not found" }, { status: 404 });
      }
      return NextResponse.json({ case: caseItem });
    }

    const cases = PersistentStore.getCases();
    return NextResponse.json({ cases });
  } catch (error: any) {
    console.error("GET /api/cases error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch cases" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const caseData: CounsellorCase = body.case || body;

    if (!caseData.contactNumber && !caseData.transcriptSummary) {
      return NextResponse.json({ error: "Invalid counsellor case payload" }, { status: 400 });
    }

    const savedCase = PersistentStore.saveCase(caseData);
    return NextResponse.json({ success: true, case: savedCase });
  } catch (error: any) {
    console.error("POST /api/cases error:", error);
    return NextResponse.json({ error: error.message || "Failed to save case" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const updatedCase = PersistentStore.updateCaseStatus(id, status, notes);
    if (!updatedCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, case: updatedCase });
  } catch (error: any) {
    console.error("PATCH /api/cases error:", error);
    return NextResponse.json({ error: error.message || "Failed to update case" }, { status: 500 });
  }
}
