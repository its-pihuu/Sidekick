export interface OnboardingOption {
    value: string
    label: string
    emoji: string
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
      question: "First things first — what should we call you?",
      subtext: "No pressure. We just don't want to call you 'user42'.",
      type: "text",
      placeholder: "Your first name",
    },
    {
      id: "q2",
      field: "background",
      question: "What's your background?",
      subtext: "We promise not to judge.",
      type: "options",
      options: [
        { value: "technical", label: "Technical", emoji: "💻", description: "I can code" },
        { value: "designer", label: "Designer", emoji: "🎨", description: "I make things pretty" },
        { value: "business", label: "Business", emoji: "💼", description: "I run the show" },
        { value: "non-technical", label: "Non-technical", emoji: "🧠", description: "I have ideas, not code" },
        { value: "student", label: "Student", emoji: "🎓", description: "Still figuring it out" },
        { value: "other", label: "Other", emoji: "✨", description: "Something else entirely" },
      ],
    },
    {
      id: "q3",
      field: "experience",
      question: "Have you built something before?",
      subtext: "Honesty unlocks better advice.",
      type: "options",
      options: [
        { value: "successful", label: "Built & succeeded", emoji: "🏆", description: "Got users, made money" },
        { value: "failed", label: "Built & failed", emoji: "💀", description: "Tried, learned, moved on" },
        { value: "first-time", label: "First-time builder", emoji: "🌱", description: "This is my first rodeo" },
        { value: "helped-others", label: "Helped others build", emoji: "🤝", description: "Was on a team" },
      ],
    },
    {
      id: "q4",
      field: "ideaStage",
      question: "Where's your idea right now?",
      subtext: "Vague is fine. Clear is great. Both work.",
      type: "options",
      options: [
        { value: "vague", label: "Vague idea", emoji: "💭", description: "Just a spark in my head" },
        { value: "clear", label: "Clear idea", emoji: "💡", description: "I know what I want to build" },
        { value: "validating", label: "Validating", emoji: "🔍", description: "Talking to people, testing" },
        { value: "building", label: "Building", emoji: "🔨", description: "Already making it" },
        { value: "launched", label: "Launched", emoji: "🚀", description: "It's live in the world" },
      ],
    },
    {
      id: "q5",
      field: "timeCommitment",
      question: "How much time can you actually give this?",
      subtext: "Be real. We won't tell anyone.",
      type: "options",
      options: [
        { value: "under-5", label: "Less than 5h/week", emoji: "⏰", description: "Side hustle vibes" },
        { value: "5-10", label: "5-10h/week", emoji: "⏱️", description: "Serious side project" },
        { value: "10-20", label: "10-20h/week", emoji: "🔥", description: "Half-committed" },
        { value: "20-plus", label: "20+h/week", emoji: "⚡", description: "Going hard" },
        { value: "full-time", label: "Full time", emoji: "🚀", description: "This is THE thing" },
      ],
    },
    {
      id: "q6",
      field: "communicationStyle",
      question: "How should I talk to you?",
      subtext: "I'll match your energy.",
      type: "options",
      options: [
        { value: "brutal", label: "Brutally honest", emoji: "🔥", description: "Roast me if needed" },
        { value: "honest-kind", label: "Honest but kind", emoji: "💛", description: "Truth with a smile" },
        { value: "supportive", label: "Supportive", emoji: "🤗", description: "Hype me up" },
        { value: "just-facts", label: "Just facts", emoji: "📊", description: "No fluff, please" },
      ],
    },
    {
      id: "q7",
      field: "biggestBlocker",
      question: "What's the BIGGEST thing stopping you?",
      subtext: "Naming it is half the battle.",
      type: "options",
      options: [
        { value: "no-start", label: "Don't know where to start", emoji: "🤷", description: "Analysis paralysis" },
        { value: "too-many-ideas", label: "Too many ideas", emoji: "🌀", description: "Can't pick one" },
        { value: "no-tech", label: "No tech skills", emoji: "💻", description: "Code feels scary" },
        { value: "no-time", label: "No time", emoji: "⏰", description: "Life is busy" },
        { value: "no-confidence", label: "No confidence", emoji: "😬", description: "Self-doubt is real" },
        { value: "no-plan", label: "No plan", emoji: "🗺️", description: "Need structure" },
      ],
    },
  ]