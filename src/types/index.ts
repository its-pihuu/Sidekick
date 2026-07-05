export interface UserProfile {
  id?: string
  name: string
  background: 'technical' | 'designer' | 'business' | 'non-technical' | 'student' | 'other'
  experience: 'successful' | 'failed' | 'first-time' | 'helped-others'
  ideaStage: 'vague' | 'clear' | 'validating' | 'building' | 'launched'
  timeCommitment: 'under-5' | '5-10' | '10-20' | '20-plus' | 'full-time'
  communicationStyle: 'brutal' | 'honest-kind' | 'supportive' | 'just-facts'
  biggestBlocker: 'no-start' | 'too-many-ideas' | 'no-tech' | 'no-time' | 'no-confidence' | 'no-plan'
  createdAt?: string
}

export interface CanvasSection {
  id: string
  title: string
  description: string
  placeholder: string
  content: string
  category: 'essential' | 'nice-to-have'
  icon: string
  order: number
}

export interface Project {
  id?: string
  userId?: string
  name: string
  profile: UserProfile
  canvas: CanvasSection[]
  createdAt?: string
  updatedAt?: string
}

export type OnboardingStep = 'welcome' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'calibrating' | 'reveal'
