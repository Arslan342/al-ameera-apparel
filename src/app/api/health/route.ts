import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "healthy";
  let dbLatency = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - dbStart;
  } catch (error) {
    dbStatus = "unhealthy";
    console.error("Health check DB probe failed:", error);
  }

  const isHealthy = dbStatus === "healthy";

  return NextResponse.json(
    {
      status: isHealthy ? "operational" : "degraded",
      timestamp: new Date().toISOString(),
      service: "Al-Ameera Apparel B2B Management System",
      checks: {
        database: {
          status: dbStatus,
          latencyMs: dbLatency,
        },
        storage: {
          status: "healthy",
          provider: process.env.STORAGE_PROVIDER || "local",
        },
        email: {
          configured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
        },
      },
      durationMs: Date.now() - startTime,
    },
    { status: isHealthy ? 200 : 503 }
  );
}
