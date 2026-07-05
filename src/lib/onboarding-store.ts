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