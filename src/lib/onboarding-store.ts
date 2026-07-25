// src/lib/onboarding-store.ts

const PROFILE_KEY = "sidekick_user_profile";
const ONBOARDED_KEY = "sidekick_onboarded";
const MANIFESTO_KEY = "sidekick_manifesto_seen";

export interface UserProfile {
  name: string;
  background: "technical" | "designer" | "business" | "non-technical" | "student" | "other";
  experience: "successful" | "failed" | "first-time" | "helped-others";
  ideaStage: "vague" | "clear" | "validating" | "building" | "launched";
  timeCommitment: "under-5" | "5-10" | "10-20" | "20-plus" | "full-time";
  communicationStyle: "brutal" | "honest-kind" | "supportive" | "just-facts";
  biggestBlocker: "no-start" | "too-many-ideas" | "no-tech" | "no-time" | "no-confidence" | "no-plan";
}

// ── Read / Write Profile (supports partial saves) ────────────────

export function saveProfile(profile: Partial<UserProfile>): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getProfile();
    const merged = { ...(existing || {}), ...profile };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
  } catch {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }
}

export function getProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_KEY);
}

// ── Onboarding Flag ───────────────────────────────────────────────

export function markOnboardingComplete(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDED_KEY, "true");
}

export function isOnboardingComplete(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDED_KEY) === "true";
}

export function clearOnboardingFlag(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ONBOARDED_KEY);
}

// ── Manifesto Flag ────────────────────────────────────────────────

export function markManifestoSeen(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MANIFESTO_KEY, "true");
}

export function hasSeenManifesto(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MANIFESTO_KEY) === "true";
}

// ── Profile → Human-Readable Context (for Gemini prompt) ─────────

export function buildProfileContext(profile: UserProfile | null): string {
  if (!profile) return "No user profile available.";

  const backgroundMap: Record<UserProfile["background"], string> = {
    technical: "a technical founder (developer/engineer)",
    designer: "a designer-founder",
    business: "a business/MBA background founder",
    "non-technical": "a non-technical founder",
    student: "a student founder",
    other: "a founder with a mixed background",
  };

  const experienceMap: Record<UserProfile["experience"], string> = {
    successful: "has launched a successful product before",
    failed: "has launched and learned from failure",
    "first-time": "is building their first product",
    "helped-others": "has helped others build but is now building their own",
  };

  const stageMap: Record<UserProfile["ideaStage"], string> = {
    vague: "has a vague idea (still figuring it out)",
    clear: "has a clear idea but hasn't started building",
    validating: "is currently validating the idea",
    building: "is actively building the product",
    launched: "has already launched",
  };

  const timeMap: Record<UserProfile["timeCommitment"], string> = {
    "under-5": "under 5 hours per week",
    "5-10": "5–10 hours per week",
    "10-20": "10–20 hours per week",
    "20-plus": "20+ hours per week",
    "full-time": "full-time on this",
  };

  const styleMap: Record<UserProfile["communicationStyle"], string> = {
    brutal: "wants brutal, no-BS honesty",
    "honest-kind": "wants honest but kind feedback",
    supportive: "wants supportive and encouraging feedback",
    "just-facts": "wants just the facts, no fluff",
  };

  const blockerMap: Record<UserProfile["biggestBlocker"], string> = {
    "no-start": "doesn't know where to start",
    "too-many-ideas": "has too many ideas and can't pick one",
    "no-tech": "lacks technical skills",
    "no-time": "is struggling with limited time",
    "no-confidence": "is battling self-doubt",
    "no-plan": "has the idea but no clear plan",
  };

  return `
FOUNDER PROFILE:
- Name: ${profile.name}
- Background: ${backgroundMap[profile.background]}
- Experience: ${experienceMap[profile.experience]}
- Idea stage: ${stageMap[profile.ideaStage]}
- Time available: ${timeMap[profile.timeCommitment]}
- Communication preference: ${styleMap[profile.communicationStyle]}
- Biggest blocker: ${blockerMap[profile.biggestBlocker]}

IMPORTANT: Adapt your tone to match their communication preference.
Address them as ${profile.name}. Be specific to their stage and background.
  `.trim();
}