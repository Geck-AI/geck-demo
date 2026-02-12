import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getRateLimitHeadersForEndpoint } from "@/lib/rateLimit";
import { handleIdempotentRequest, getIdempotencyKey } from "@/lib/idempotency";

const ORDERS_CSV = path.join(process.cwd(), "public", "data", "orders.csv");
const CSV_HEADER =
  "orderId,name,streetAddress,city,state,zipcode,totalAmount,timestamp,itemsJson\n";

function append(row: string) {
  try {
    // Check if we are in an environment where we can write to the public folder
    // On Vercel this will fail, so we catch the error
    if (!fs.existsSync(ORDERS_CSV)) {
      const dir = path.dirname(ORDERS_CSV);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(ORDERS_CSV, CSV_HEADER);
    }
    fs.appendFileSync(ORDERS_CSV, row);
  } catch (error) {
    console.warn("Failed to append to orders.csv (expected on Vercel):", error);
    // On Vercel / serverless environments, we might want to log this or use a database
    // For this demo, we'll allow it to fail silently to avoid 500 errors
  }
}

export async function POST(req: NextRequest) {
  // Add rate limit headers
  const rateLimitHeaders = getRateLimitHeadersForEndpoint('/api/services/orders');

  // Handle idempotent request
  const idempotencyKey = getIdempotencyKey(req);
  const result = await handleIdempotentRequest(
    req,
    async () => {
      const body = await req.json();
      const {
        name,
        streetAddress,
        city,
        state,
        zipcode,
        items,
        totalAmount,
        timestamp,
      } = body;

      // Generate a plausible e-commerce order id: e.g. "ORD-20240610-ABCD"
      // Use idempotency key to generate deterministic order ID if provided
      function generateOrderId() {
        if (idempotencyKey) {
          // Use hash of idempotency key to generate deterministic order ID
          const hash = crypto.createHash('sha256').update(idempotencyKey).digest('hex');
          const date = new Date();
          const y = date.getFullYear().toString().slice(-2);
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const d = String(date.getDate()).padStart(2, "0");
          return `ORD-${y}${m}${d}-${hash.substring(0, 4).toUpperCase()}`;
        }
        const date = new Date();
        const y = date.getFullYear().toString().slice(-2);
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        const letters = Array.from({ length: 4 }, () =>
          String.fromCharCode(65 + Math.floor(Math.random() * 26))
        ).join("");
        return `${letters}-${y}${m}${d}`;
      }
      const orderId = generateOrderId();
      const arrivalDate = new Date(Date.now() + 3 * 86_400_000)
        .toISOString()
        .split("T")[0];

      /* Improved CSV escaping */
      const toCsvField = (v: any) => {
        const str = String(v ?? "");
        // Escape quotes and wrap in quotes
        return `"${str.replace(/"/g, '""')}"`;
      };

      append(
        [
          orderId,
          toCsvField(name),
          toCsvField(streetAddress),
          toCsvField(city),
          toCsvField(state),
          toCsvField(zipcode),
          totalAmount,
          timestamp,
          toCsvField(JSON.stringify(items)),
        ].join(",") + "\n"
      );

      const responseData = {
        orderId,
        status: "success",
        message: "Order placed successfully",
        arrivalDate,
        orderDetails: {
          name,
          streetAddress,
          city,
          state,
          zipcode,
          totalAmount,
          timestamp,
          items,
        },
      };

      return {
        statusCode: 200,
        response: responseData,
      };
    },
    24 * 60 * 60 // 24 hour TTL for order idempotency
  );

  const response = NextResponse.json(result.response, {
    status: result.statusCode,
  });

  // Add rate limit headers
  rateLimitHeaders.forEach((value, key) => response.headers.set(key, value));

  // Add idempotency headers
  if (idempotencyKey) {
    response.headers.set('Idempotency-Key', idempotencyKey);
    response.headers.set('Idempotency-Replay', result.fromCache ? 'true' : 'false');
  }

  return response;
}

