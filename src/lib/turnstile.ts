const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || "";

export async function verifyTurnstile(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET || TURNSTILE_SECRET === "your_turnstile_secret_here") {
    // Skip verification in dev if no key configured
    return true;
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
      }),
    });

    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}
