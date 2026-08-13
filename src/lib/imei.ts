import type { IMEILookup } from "./types";

/**
 * IMEI lookup service — modular and pluggable.
 *
 * Currently extracts basic info from the IMEI TAC (first 8 digits).
 * To plug in a real API (e.g., IMEI.info, CheckMEND), update the
 * fetchFromAPI function below and add your API key to .env
 */

// TAC database — maps first 8 digits of IMEI to brand/model
// This is a small sample; extend as needed or replace with API
const TAC_DB: Record<string, { brand: string; model: string }> = {
  "35332510": { brand: "Apple", model: "iPhone 15 Pro" },
  "35467811": { brand: "Apple", model: "iPhone 14" },
  "35407115": { brand: "Apple", model: "iPhone 13" },
  "86789005": { brand: "Samsung", model: "Galaxy S24" },
  "35262211": { brand: "Samsung", model: "Galaxy S23" },
  "86415604": { brand: "OnePlus", model: "12" },
  "86073003": { brand: "Xiaomi", model: "14" },
  "86523905": { brand: "Google", model: "Pixel 8" },
};

/** Validate an IMEI number (15 digits, Luhn check) */
export function validateIMEI(imei: string): boolean {
  if (!/^\d{15}$/.test(imei)) return false;
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let d = parseInt(imei[i], 10);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

/** Look up IMEI info — returns available data or empty fields */
export async function lookupIMEI(imei: string): Promise<IMEILookup> {
  const tac = imei.substring(0, 8);
  const tacInfo = TAC_DB[tac];

  // If you have an IMEI API key, uncomment and configure:
  // const apiResult = await fetchFromAPI(imei);
  // if (apiResult) return apiResult;

  return {
    brand: tacInfo?.brand || "",
    model: tacInfo?.model || "",
    storage: "",
    imei,
    serial: "",
    status: tacInfo ? "Valid IMEI" : "Unknown",
    blacklisted: false,
    warranty: "",
  };
}

/** Placeholder for external IMEI API integration */
// async function fetchFromAPI(imei: string): Promise<IMEILookup | null> {
//   const apiKey = process.env.IMEI_API_KEY;
//   if (!apiKey) return null;
//   try {
//     const res = await fetch(`https://api.example.com/imei/${imei}`, {
//       headers: { "Authorization": `Bearer ${apiKey}` },
//     });
//     if (!res.ok) return null;
//     const data = await res.json();
//     return { brand: data.brand, model: data.model, ... };
//   } catch { return null; }
// }
