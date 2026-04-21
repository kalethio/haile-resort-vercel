import { NextResponse } from "next/server";

// Store captcha codes temporarily (in production, use Redis or database)
const captchaStore = new Map<string, { code: string; expires: number }>();

export async function POST() {
  try {
    // Generate random 6-character CAPTCHA
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
    let captchaCode = "";
    for (let i = 0; i < 6; i++) {
      captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Generate unique ID for this CAPTCHA
    const captchaId = Math.random().toString(36).substring(2, 15);

    // Store with 5 minute expiry
    captchaStore.set(captchaId, {
      code: captchaCode,
      expires: Date.now() + 5 * 60 * 1000,
    });

    // Clean up expired entries
    for (const [key, value] of captchaStore.entries()) {
      if (value.expires < Date.now()) {
        captchaStore.delete(key);
      }
    }

    return NextResponse.json({
      captchaId,
      captchaCode,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate CAPTCHA" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { captchaId, userInput } = await request.json();

    const stored = captchaStore.get(captchaId);
    if (!stored) {
      return NextResponse.json({ valid: false, error: "CAPTCHA expired" });
    }

    if (stored.expires < Date.now()) {
      captchaStore.delete(captchaId);
      return NextResponse.json({ valid: false, error: "CAPTCHA expired" });
    }

    const isValid = stored.code === userInput.toUpperCase();
    if (isValid) {
      captchaStore.delete(captchaId);
    }

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
