import { NextRequest, NextResponse } from "next/server";
import { PersistentStore } from "@/lib/data/persistentStore";
import { CounsellingSession } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const familyId = searchParams.get("familyId");

    if (id) {
      const session = PersistentStore.getSessionById(id);
      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      return NextResponse.json({ session });
    }

    if (familyId) {
      const sessions = PersistentStore.getSessionsByFamilyId(familyId);
      return NextResponse.json({ sessions });
    }

    const sessions = PersistentStore.getSessions();
    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error("GET /api/sessions error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session: CounsellingSession = body.session || body;

    if (!session.profile && !session.messages) {
      return NextResponse.json({ error: "Invalid session payload" }, { status: 400 });
    }

    const savedSession = PersistentStore.saveSession(session);
    return NextResponse.json({ success: true, session: savedSession });
  } catch (error: any) {
    console.error("POST /api/sessions error:", error);
    return NextResponse.json({ error: error.message || "Failed to save session" }, { status: 500 });
  }
}
