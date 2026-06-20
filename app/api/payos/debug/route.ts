import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;

/**
 * Debug endpoint for testing PayOS webhook signature verification
 *
 * This endpoint helps you verify that your PAYOS_CHECKSUM_KEY is correct
 * and that the signature calculation method matches PayOS expectations.
 *
 * SECURITY WARNING:
 * This endpoint should only be used in development. Disable it in production.
 * It exposes your checksum key details in the response.
 *
 * Usage:
 * POST /api/payos/debug
 *
 * Request body:
 * {
 *   "payload": { ... your test payload ... },
 *   "signature": "the-signature-to-verify"
 * }
 *
 * Or test without signature:
 * {
 *   "payload": { ... your test payload ... }
 * }
 *
 * Returns:
 * {
 *   "checksumKeySet": boolean,
 *   "checksumKeyLength": number,
 *   "payload": object,
 *   "calculations": {
 *     "method1": "signature using JSON stringify",
 *     "method2": "signature using stable stringify"
 *   },
 *   "receivedSignature": "if provided",
 *   "matches": {
 *     "method1": boolean,
 *     "method2": boolean
 *   }
 * }
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

export async function POST(request: NextRequest) {
  // SECURITY: Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Debug endpoint disabled in production" },
      { status: 403 },
    );
  }

  try {
    const { payload, signature } = await request.json();

    if (!payload) {
      return NextResponse.json(
        { error: "Missing 'payload' in request body" },
        { status: 400 },
      );
    }

    if (!PAYOS_CHECKSUM_KEY) {
      return NextResponse.json(
        {
          error: "PAYOS_CHECKSUM_KEY not configured in .env.local",
          hint: "Add PAYOS_CHECKSUM_KEY=your-key to .env.local",
        },
        { status: 400 },
      );
    }

    // Remove signature from payload if present
    const payloadToSign = { ...payload };
    delete payloadToSign.signature;

    // Try different signature calculation methods
    const sig1 = calculateSignature(payloadToSign, PAYOS_CHECKSUM_KEY, "json");
    const sig2 = calculateSignature(
      payloadToSign,
      PAYOS_CHECKSUM_KEY,
      "stable",
    );

    const response: any = {
      checksumKeySet: true,
      checksumKeyLength: PAYOS_CHECKSUM_KEY.length,
      payload: payloadToSign,
      calculations: {
        method1_json: sig1,
        method2_stable: sig2,
      },
      receivedSignature: signature || null,
    };

    if (signature) {
      response.matches = {
        method1_json: sig1 === signature,
        method2_stable: sig2 === signature,
      };

      if (sig1 === signature) {
        response.hint = "✓ Signature matches using JSON stringify method";
      } else if (sig2 === signature) {
        response.hint = "✓ Signature matches using stable stringify method";
      } else {
        response.hint =
          "✗ Signature doesn't match either method. Check your PAYOS_CHECKSUM_KEY.";
      }
    } else {
      response.hint =
        "No signature provided. If you provide a 'signature' field, we'll verify it against both calculation methods.";
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("[PayOS Debug] Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Server error" },
      { status: 500 },
    );
  }
}
