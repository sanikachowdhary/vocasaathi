import { NextRequest, NextResponse } from "next/server";
import { PersistentStore } from "@/lib/data/persistentStore";
import { FamilyProfile } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const family = PersistentStore.getFamilyById(id);
      if (!family) {
        return NextResponse.json({ error: "Family not found" }, { status: 404 });
      }
      return NextResponse.json({ family });
    }

    const families = PersistentStore.getFamilies();
    return NextResponse.json({ families });
  } catch (error: any) {
    console.error("GET /api/families error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch families" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: FamilyProfile = body.profile || body;

    if (!profile.learnerName && !profile.userType) {
      return NextResponse.json({ error: "Invalid family profile payload" }, { status: 400 });
    }

    const savedFamily = PersistentStore.saveFamily(profile);
    return NextResponse.json({ success: true, family: savedFamily });
  } catch (error: any) {
    console.error("POST /api/families error:", error);
    return NextResponse.json({ error: error.message || "Failed to save family" }, { status: 500 });
  }
}
