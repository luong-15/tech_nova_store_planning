import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;
const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

/**
 * Debug endpoint for testing PayOS webhook signature verification
 *
 * ⚠️  SECURITY WARNING:
 * This endpoint is ONLY available in development mode.
 * It exposes sensitive checksum key information in responses.
 *
 * NEVER expose this endpoint in production!
 *
 * Usage:
 * POST /api/payos/debug
 * {
 *   "payload": { code: "00", success: true, data: {...} },
 *   "signature": "optional-signature-to-verify"
 * }
 *
 * GET /api/payos/debug
 * Returns: { ready: true, configured: boolean }
 */

function stableStringify(obj: any): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return JSON.stringify(obj.map(stableStringify));
  const keys = Object.keys(obj).sort();
  const out: any = {};
  for (const k of keys) out[k] = stableStringify(obj[k]);
  return JSON.stringify(out);
}

function calculateSignature(
  payload: any,
  key: string,
  method: "json" | "stable" = "stable",
): string {
  const message =
    method === "json" ? JSON.stringify(payload) : stableStringify(payload);
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(message);
  return hmac.digest("hex");
}

/**
 * GET handler - Health check
 */
export async function GET() {
  if (!IS_DEVELOPMENT) {
    return NextResponse.json(
      { error: "Debug endpoint disabled in production" },
      { status: 403 },
    );
  }

  return NextResponse.json({
    ready: true,
    environment: "development",
    configured: !!PAYOS_CHECKSUM_KEY,
    message: "PayOS debug endpoint ready. POST payload with signature to test.",
  });
}

/**
 * POST handler - Signature verification test
 */
export async function POST(request: NextRequest) {
  if (!IS_DEVELOPMENT) {
    return NextResponse.json(
      { error: "Debug endpoint disabled in production" },
      { status: 403 },
    );
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const { payload, signature } = body;

    // Validate input
    if (!payload) {
      return NextResponse.json(
        {
          error: "Missing 'payload' field",
          example: {
            payload: {
              code: "00",
              success: true,
              data: { orderCode: "ORD-001", amount: 100000 },
            },
          },
        },
        { status: 400 },
      );
    }

    if (!PAYOS_CHECKSUM_KEY) {
      return NextResponse.json(
        {
          error: "PAYOS_CHECKSUM_KEY not configured",
          hint: "Add PAYOS_CHECKSUM_KEY to .env.local",
        },
        { status: 400 },
      );
    }

    // Prepare payload for signing (remove existing signature)
    const payloadToSign = { ...payload };
    delete payloadToSign.signature;

    // Calculate signatures
    const stableSignature = calculateSignature(
      payloadToSign,
      PAYOS_CHECKSUM_KEY,
      "stable",
    );
    const jsonSignature = calculateSignature(
      payloadToSign,
      PAYOS_CHECKSUM_KEY,
      "json",
    );

    // Build response
    const result: any = {
      success: true,
      configured: true,
      checksumKeyLength: PAYOS_CHECKSUM_KEY.length,
      payload: payloadToSign,
      signatures: {
        stable: stableSignature,
        json: jsonSignature,
      },
    };

    // If signature provided, verify it
    if (signature) {
      const matches = {
        stable: stableSignature === signature,
        json: jsonSignature === signature,
      };

      result.receivedSignature = signature;
      result.matches = matches;

      if (matches.stable) {
        result.status = "✓ VALID - Matches stable signature method";
      } else if (matches.json) {
        result.status = "✓ VALID - Matches JSON signature method";
      } else {
        result.status = "✗ INVALID - Signature doesn't match either method";
        result.hint =
          "Check PAYOS_CHECKSUM_KEY in .env.local matches PayOS Dashboard";
      }
    } else {
      result.hint = "Provide 'signature' field to verify it";
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[PayOS Debug] Error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
