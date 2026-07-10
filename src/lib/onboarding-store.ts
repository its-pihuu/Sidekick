"use client"

const PROFILE_KEY = "sidekick_user_profile"
const MANIFESTO_KEY = "sidekick_manifesto_seen"

export interface UserProfile {
  name?: string
  background?: string
  experience?: string
  ideaStage?: string
  timeCommitment?: string
  communicationStyle?: string
  biggestBlocker?: string
  createdAt?: string
}

export const saveProfile = (profile: Partial<UserProfile>) => {
  if (typeof window === "undefined") return
  const existing = getProfile()
  const updated = { ...existing, ...profile }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated))
}

export const getProfile = (): Partial<UserProfile> => {
  if (typeof window === "undefined") return {}
  const data = localStorage.getItem(PROFILE_KEY)
  return data ? JSON.parse(data) : {}
}

export const clearProfile = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(PROFILE_KEY)
}

export const hasSeenManifesto = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem(MANIFESTO_KEY) === "true"
}

export const markManifestoSeen = () => {
  if (typeof window === "undefined") return
  localStorage.setItem(MANIFESTO_KEY, "true")
}

export const resetManifesto = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(MANIFESTO_KEY)
}
// ─── AI CONTEXT BUILDER ─────────────────────────────────────────────────
// Converts the raw profile into human-readable context for Gemini.

const BACKGROUND_LABELS: Record<string, string> = {
  technical: "technical (can code)",
  designer: "designer (visual thinker)",
  business: "business-minded (runs the show)",
  "non-technical": "non-technical (ideas person, not a coder)",
  student: "a student, still figuring things out",
  other: "from a mixed background",
}

const EXPERIENCE_LABELS: Record<string, string> = {
  successful: "has built and succeeded before (got users, made money)",
  failed: "has built and failed before (tried, learned, moved on)",
  "first-time": "is a first-time builder (this is their first rodeo)",
  "helped-others": "has helped others build things (been on a team)",
}

const IDEA_STAGE_LABELS: Record<string, string> = {
  vague: "still vague — just a spark in their head",
  clear: "clear in their head — they know what they want to build",
  validating: "in validation mode — talking to people, testing",
  building: "actively being built right now",
  launched: "already launched and live in the world",
}

const TIME_LABELS: Record<string, string> = {
  "under-5": "less than 5 hours a week (side hustle vibes)",
  "5-10": "5-10 hours a week (serious side project)",
  "10-20": "10-20 hours a week (half-committed)",
  "20-plus": "20+ hours a week (going hard)",
  "full-time": "full time (this is THE thing)",
}

const COMMUNICATION_LABELS: Record<string, string> = {
  brutal: "brutally honest — they want you to ROAST them when needed. Don't soften. Push hard.",
  "honest-kind": "honest but kind — deliver truth with warmth. No harsh edges.",
  supportive: "supportive — hype them up while still being useful. Encourage first, then advise.",
  "just-facts": "no fluff, just facts — skip pleasantries, deliver information cleanly.",
}

const BLOCKER_LABELS: Record<string, string> = {
  "no-start": "doesn't know where to start (analysis paralysis)",
  "too-many-ideas": "has too many ideas and can't pick one",
  "no-tech": "feels blocked by lack of tech skills",
  "no-time": "feels blocked by lack of time",
  "no-confidence": "struggles with self-doubt and confidence",
  "no-plan": "needs structure and a real plan",
}

export const buildProfileContext = (profile: Partial<UserProfile>): string => {
  if (!profile || Object.keys(profile).length === 0) {
    return "" // No profile yet — Sidekick will be generic
  }

  const lines: string[] = []

  if (profile.name) {
    lines.push(`Their name is ${profile.name}. Use it naturally sometimes — not every reply, but when it makes the moment feel personal.`)
  }

  if (profile.background && BACKGROUND_LABELS[profile.background]) {
    lines.push(`Background: ${BACKGROUND_LABELS[profile.background]}.`)
  }

  if (profile.experience && EXPERIENCE_LABELS[profile.experience]) {
    lines.push(`Experience: ${EXPERIENCE_LABELS[profile.experience]}.`)
  }

  if (profile.ideaStage && IDEA_STAGE_LABELS[profile.ideaStage]) {
    lines.push(`Their idea is currently: ${IDEA_STAGE_LABELS[profile.ideaStage]}.`)
  }

  if (profile.timeCommitment && TIME_LABELS[profile.timeCommitment]) {
    lines.push(`Time commitment: ${TIME_LABELS[profile.timeCommitment]}.`)
  }

  if (profile.biggestBlocker && BLOCKER_LABELS[profile.biggestBlocker]) {
    lines.push(`Their biggest blocker right now: ${BLOCKER_LABELS[profile.biggestBlocker]}.`)
  }

  if (profile.communicationStyle && COMMUNICATION_LABELS[profile.communicationStyle]) {
    lines.push(`COMMUNICATION STYLE (CRITICAL): ${COMMUNICATION_LABELS[profile.communicationStyle]}`)
  }

  return lines.join("\n")
}