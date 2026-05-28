import { NextResponse } from "next/server";

import { isSandboxMode } from "@/server/sandbox";

/**
 * Read-only probe: returns whether the running deployment has
 * KANAA_SANDBOX_MODE enabled. Used for quick smoke checks (does the
 * sandbox URL really have the flag?  does production really not?).
 * Exposes no secrets — only the resolved boolean.
 */
export function GET() {
  return NextResponse.json({ sandbox: isSandboxMode() });
}
