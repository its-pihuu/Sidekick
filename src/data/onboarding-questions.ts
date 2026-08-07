export interface OnboardingOption {
  value: string
  label: string
  description?: string
}

export interface OnboardingQuestion {
  id: string
  field: string
  question: string
  subtext?: string
  type: "text" | "options"
  options?: OnboardingOption[]
  placeholder?: string
}

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: "q1",
    field: "name",
    question: "First — what should we call you?",
    subtext: "No pressure. We just refuse to call you 'user42'.",
    type: "text",
    placeholder: "Your first name",
  },
  {
    id: "q2",
    field: "background",
    question: "What is your background?",
    subtext: "This shapes how we build with you.",
    type: "options",
    options: [
      { value: "technical", label: "Technical", description: "I can code" },
      { value: "designer", label: "Designer", description: "I shape how things look and feel" },
      { value: "business", label: "Business", description: "I run the show" },
      { value: "non-technical", label: "Non-technical", description: "I have ideas, not code" },
      { value: "student", label: "Student", description: "Still figuring it out" },
      { value: "other", label: "Other", description: "Something else entirely" },
    ],
  },
  {
    id: "q3",
    field: "experience",
    question: "Have you built something before?",
    subtext: "Honesty unlocks sharper advice.",
    type: "options",
    options: [
      { value: "successful", label: "Built and succeeded", description: "Got users. Made money." },
      { value: "failed", label: "Built and failed", description: "Tried. Learned. Moved on." },
      { value: "first-time", label: "First-time builder", description: "This is my first move." },
      { value: "helped-others", label: "Helped others build", description: "Was on the team, not the throne." },
    ],
  },
  {
    id: "q4",
    field: "ideaStage",
    question: "Where is your idea right now?",
    subtext: "Vague is fine. Clear is better. Both work.",
    type: "options",
    options: [
      { value: "vague", label: "Vague idea", description: "Just a spark" },
      { value: "clear", label: "Clear idea", description: "I know what I want to build" },
      { value: "validating", label: "Validating", description: "Talking to people. Testing." },
      { value: "building", label: "Building", description: "Already in motion" },
      { value: "launched", label: "Launched", description: "It is live in the world" },
    ],
  },
  {
    id: "q5",
    field: "timeCommitment",
    question: "How much time can you actually give this?",
    subtext: "Be real. Discipline is the only currency that matters.",
    type: "options",
    options: [
      { value: "under-5", label: "Less than 5h per week", description: "Side hustle" },
      { value: "5-10", label: "5 to 10h per week", description: "Serious side project" },
      { value: "10-20", label: "10 to 20h per week", description: "Half committed" },
      { value: "20-plus", label: "20+h per week", description: "Going hard" },
      { value: "full-time", label: "Full time", description: "This is the only thing" },
    ],
  },
  {
    id: "q6",
    field: "biggestBlocker",
    question: "What is the biggest thing stopping you?",
    subtext: "Naming it is half the battle.",
    type: "options",
    options: [
      { value: "no-start", label: "Do not know where to start", description: "Analysis paralysis" },
      { value: "too-many-ideas", label: "Too many ideas", description: "Cannot pick one" },
      { value: "no-tech", label: "No tech skills", description: "Code feels distant" },
      { value: "no-time", label: "No time", description: "Life is loud" },
      { value: "no-confidence", label: "No confidence", description: "Self-doubt is real" },
      { value: "no-plan", label: "No plan", description: "Need structure" },
    ],
  },
]