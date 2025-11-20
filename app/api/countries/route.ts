// app/api/countries/route.ts
import { NextResponse } from "next/server";

// Essential countries for your hotel market
const COUNTRIES = [
  { code: "ET", name: "Ethiopia", phoneCode: "+251" },
  { code: "US", name: "United States", phoneCode: "+1" },
  { code: "GB", name: "United Kingdom", phoneCode: "+44" },
  { code: "CN", name: "China", phoneCode: "+86" },
  { code: "IN", name: "India", phoneCode: "+91" },
  { code: "DE", name: "Germany", phoneCode: "+49" },
  { code: "FR", name: "France", phoneCode: "+33" },
  { code: "AE", name: "United Arab Emirates", phoneCode: "+971" },
  { code: "SA", name: "Saudi Arabia", phoneCode: "+966" },
  { code: "KE", name: "Kenya", phoneCode: "+254" },
].sort((a, b) => a.name.localeCompare(b.name));

export async function GET() {
  try {
    return NextResponse.json(COUNTRIES);
  } catch (error) {
    console.error("Countries API error:", error);
    return NextResponse.json(COUNTRIES); // Fallback
  }
}
