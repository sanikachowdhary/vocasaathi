import { NextRequest, NextResponse } from "next/server";
import { PersistentStore } from "@/lib/data/persistentStore";

export async function GET(req: NextRequest) {
  try {
    const analytics = PersistentStore.getAdminAnalytics();
    return NextResponse.json({ analytics });
  } catch (error: any) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json({ error: error.message || "Failed to calculate analytics" }, { status: 500 });
  }
}
