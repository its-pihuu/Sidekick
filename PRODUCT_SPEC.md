# SIDEKICK — Product Specification
> "Every great founder has a sidekick."
> Version 1.0 · July 2026 · Written by Prachi (Pihu), Founder

---

## THE ELEVATOR PITCH

Sidekick is the operating system for future founders.
Write your plan. See your plan. Ship your plan.

Every idea travels through three AI-powered surfaces — a structured writer,
a visual canvas, and a shipping studio — each tuned for founders who think
big but need help turning chaos into clarity.

Walk in with a vision. Walk out with a plan.

---

## WHO IT'S FOR

- First-time founders with an idea stuck in their head
- Indie hackers who need structure, not another blank page
- Students who think big but don't know where to start
- Side-project builders juggling ideas and time
- Non-technical founders who need a thinking partner, not a coder

**Not for:** Enterprise teams, established companies, developers who already ship.

---

## WHAT IT REPLACES

| Tool | What it does | What Sidekick does better |
|------|-------------|--------------------------|
| ChatGPT | Blank box, no structure | 11 structured sections + specialist AIs |
| Notion | Docs with AI glued on | AI-native from day one, built for founders |
| Gamma | Slides first | Planning first, then slides |
| Miro | Visual canvas, no export | Canvas + Writer + Document in one |
| Google Docs | Just a doc | AI-powered doc generator with themes |

---

## THE USER FLOW

### 1. Landing Page
- Cinematic intro (3s theatrical)
- Hero: "Walk in with a vision. Walk out with a plan."
- 8 sections: Problem, How It Works, What's Inside, Beliefs, Whispers, FAQ, CTA, Footer
- Brand: Chinese Black + Antique Brass + Cormorant Garamond

### 2. Onboarding (7 questions)
- Name, Background, Experience, Idea Stage, Time, Communication Style, Biggest Blocker
- Saved to localStorage (future: Supabase)
- Used to personalize ALL AI interactions

### 3. Calibration Screen
- Poetic "spa scan" — "Reading your rhythm..."
- 7 animated steps, builds anticipation

### 4. Manifesto (3 slides)
- Emotional welcome — makes user feel like they belong
- Uses their name in accent color
- Sets the tone for the whole experience

### 5. Reveal
- "Welcome home, [name]."
- Cinematic transition into the workspace

### 6. Projects Dashboard (future)
- Create, name, and manage multiple projects
- Each project has its own canvas, documents, and AI history
- Switch between projects seamlessly

### 7. Inside a Project — THREE WORKSPACES

---

## THE THREE WORKSPACES

### 🖊️ WORKSPACE 1 — THE WRITER (Write View)

The structured thinking surface. Linear. Focused. One section at a time.

**What it has:**
- 11 canvas sections, stacked vertically:
  01. The Problem
  02. Your Solution
  03. Target Users
  04. Value Proposition
  05. Revenue Model
  06. Competitors
  07. Key Features
  08. Go-To-Market
  09. Key Metrics
  10. Risks & Assumptions
  11. The Big Vision

- Each section has:
  - Title + subtitle + placeholder prompt
  - Text editor (type, paste, or ask AI to draft)
  - Word count
  - "Ask" button → opens section-specific AI
  - Auto-save (1s debounce, localStorage)

**Section-Specific AI (SPECIALIST AIs):**
- Each section has its OWN AI persona trained for that domain
- The Problem AI → obsessed with pain points, JTBD, user interviews
- The Solution AI → focused on product design, MVP scoping
- The Target Users AI → personas, ICP, segmentation
- The Value Prop AI → positioning, messaging, differentiation
- The Revenue Model AI → pricing, unit economics, business models
- The Competitor AI → market analysis, moats, positioning
- The Features AI → roadmap, prioritization, tradeoffs
- The GTM AI → launch strategy, distribution, growth loops
- The Metrics AI → north star metrics, KPIs, measurement
- The Risk AI → assumptions, kill criteria, red flags
- The Vision AI → mission, long-term narrative, moonshot thinking

**AI capabilities in Writer:**
- Answer questions about the specific section
- Draft content for the section
- Critique what's already written
- Suggest improvements
- Ask probing founder questions

### 🖼️ WORKSPACE 2 — THE CANVAS (Canvas View)

The visual thinking surface. Spatial. Creative. See the whole picture.

**Default: Bento Grid**
- 11 cards in beautiful asymmetric grid layout
- Each card shows: section title, preview text, completion %
- Click a card → expands to edit
- Empty sections = elegant empty state

**Toggle: Mindmap Mode**
- Central node = Project Name
- Branches to all 11 sections
- Users draw arrows between sections to show connections
- "Problem → Solution → GTM" type flows
- Colors from active theme

**Toggle: Roadmap Mode**
- Horizontal timeline view
- Drag sections onto phases (Month 1, Month 2, MVP, Launch)
- Turns plan into a build sequence
- Visual progress tracking

### 📄 WORKSPACE 3 — THE STUDIO (Document View)

The shipping surface. Export. Present. Impress.

**What it has:**
- Clean editorial document layout
- Palette picker (Classic, Newsprint, Midnight, Botanical)
- "Download PDF" button
- Only shows filled sections (empty ones skipped)
- Cover page: project name, author, date
- Section numbering, hairline dividers, luxury typography
- "Built with Sidekick·" footer

**Document AI (future):**
- Full AI panel specifically for document creation
- Generate pitch decks from canvas content
- Generate brochures, one-pagers, investor summaries
- Choose tone, language, template
- Like Gamma.ai but integrated into the planning flow
- Download as PDF, PPTX, or share via link

**Document types (future):**
- Product Plan (current)
- Pitch Deck
- One-Pager / Executive Summary
- Brochure
- Investor Memo
- Lean Canvas Export

---

## THE ASK PANEL (Global AI)

A floating, always-accessible AI chat — like ChatGPT but for business.

**What it is:**
- Floating button (bottom-right or top bar)
- Opens full-screen chat panel
- Left sidebar shows conversation history
- Generalist business AI (not section-specific)
- Has access to entire canvas + user profile
- For questions like: "What's my weakest section?" / "Give me a pitch deck outline" / "How do I validate this idea?"

**Features:**
- Chat history saved to localStorage (future: Supabase)
- Users can toggle history OFF in Settings (privacy-first)
- Conversations are named/titled automatically
- Multiple conversation threads
- Search through past conversations

---

## SETTINGS PAGE

- Profile management (edit name, background, etc.)
- Communication style preference (changeable anytime)
- Theme preference (Burgundy / Midnight / Botanical)
- Document palette preference
- Chat history toggle (on/off)
- Notification preferences
- Data export (download all your data)
- Delete account / clear all data
- Voice input toggle (future)

---

## NOTIFICATIONS

- "You haven't worked on [Project] in 3 days. Your idea misses you."
- "Section [X] is empty. Want a nudge from Sidekick?"
- "You've completed 80% of your plan. Finish strong."
- Weekly summary email: "Here's what you worked on this week."
- Milestone celebrations: "You completed your first plan!"
- All notifications written in Sidekick's brand voice (witty, cheeky)

---

## REFERRAL SYSTEM (future)

- "Invite a friend → both get 1 month of premium free"
- Unique referral link per user
- Referral dashboard: see who signed up via your link
- Social sharing: "I just built my product plan on Sidekick"
- Leaderboard: top referrers get featured

---

## TEMPLATES GALLERY (future)

- Pre-filled canvas templates for common business types:
  - SaaS product
  - E-commerce store
  - Mobile app
  - Content creator business
  - Freelance service
  - Physical product
  - Community / platform
- Users can start from a template or blank canvas
- Community-submitted templates (future)

---

## VOICE INPUT (future)

- Microphone button in Writer sections
- Speak your thoughts → auto-transcribed into the section
- "Talk to Sidekick" — voice conversation with AI
- Perfect for founders who think better out loud
- Uses browser's Speech Recognition API (free)

---

## TEAM COLLABORATION (future)

- Invite cofounders to a project
- Real-time editing (like Google Docs)
- Comments on sections
- Role-based access (Owner, Editor, Viewer)
- Activity feed: "Prachi edited The Problem section"
- Team chat within project

---

## MONETIZATION

### Phase 1: FREE FOR ALL (0 → 150 users)
Everything is free. All features unlocked. Build audience, gather feedback,
prove value, let users get addicted.

### Phase 2: PREMIUM PAYWALL (150+ users)
When 150 users sign up, premium features become paid.

**FREE TIER (forever):**
- Landing page access
- Full onboarding experience
- Basic Writer (all 11 sections, manual typing)
- Basic Canvas (bento grid view)
- Basic Document (PDF export with default palette)
- Generic AI (limited messages per day — e.g., 10/day)
- 1 project

**PREMIUM TIER (₹TBD/month):**
- Everything in Free
- 11 Specialist AIs (one per section)
- Unlimited AI messages (Ask panel + section AI + document AI)
- Canvas Mindmap + Roadmap modes
- Document Studio (pitch decks, brochures, one-pagers)
- All document palettes + custom themes
- Multiple projects (unlimited)
- Chat history (full, searchable)
- Voice input
- Priority support
- Early access to new features

**Pricing (to be decided at 150 users):**
- Target: ₹299-999/month OR
- Lifetime deal for early adopters (₹2999 one-time)
- Annual discount (pay 10 months, get 12)

---

## TECH STACK

- **Frontend:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **AI:** Google Gemini API (gemini-flash-lite-latest)
- **Database (future):** Supabase (PostgreSQL)
- **Auth (future):** Supabase Auth
- **Payments (future):** Razorpay
- **Hosting:** Vercel (free tier)
- **Storage:** localStorage (current) → Supabase (future)
- **Voice (future):** Web Speech API
- **PDF:** react-to-print (current) → custom PDF engine (future)
- **Pitch Decks (future):** Custom slide renderer or integration

---

## DESIGN SYSTEM

### Brand Voice
- Bold + Witty + Slightly cheeky + Sharp
- "A witty friend who roasts you, but pushes you to actually build the damn thing."
- "Expensive on the OUTSIDE. Witty on the INSIDE."

### Typography
- Cormorant Garamond (serif italic — headlines, quotes, wit)
- Inter (body, UI, buttons)
- JetBrains Mono (tiny labels — "SECTION 01", "STEP 03 · 07")

### Colors
- Landing: Chinese Black (#0C1519) + Antique Brass (#CF9D7B)
- Onboarding: Dark Green (#0A3323) + Rosy Brown (#D3968C)
- Canvas themes: Burgundy / Midnight / Botanical

### Rules
- NO emojis in UI
- NO doodles
- NO purple/blue/pink gradients
- Editorial layout (Vogue meets Linear)
- Inverted cards (light on dark)
- Hairline borders (rgba 0.08)
- Generous whitespace
- All easing: [0.16, 1, 0.3, 1] (expo out)

---

## SUCCESS VISION (2-YEAR)

- **Users:** Millions → Billions (global scale)
- **Revenue:** Cross ₹1 Billion+
- **Market:** Global — every country, every language
- **Team:** Solo founder (Prachi / Pihu)
- **Platform:** Web first → Mobile app later
- **Position:** The #1 tool founders use before they build anything
- **Brand recognition:** "Every founder starts with Sidekick"

---

## BUILD PRIORITY (current)

### ✅ SHIPPED
- [x] Luxury landing page (8 sections)
- [x] Onboarding flow (7 questions + calibration + manifesto + reveal)
- [x] Canvas Write mode (11 sections, auto-save)
- [x] 3 canvas themes (Burgundy / Midnight / Botanical)
- [x] Gemini AI integration (Ask per section)
- [x] Onboarding memory (AI knows the user)
- [x] Document view + PDF export
- [x] Document palette picker (4 palettes)
- [x] Deployed to Vercel (sidekick-inky.vercel.app)
- [x] GitHub repo (its-pihuu/Sidekick)

### 🔨 BUILDING NOW
- [ ] Per-section chat history
- [ ] Global Ask Sidekick panel
- [ ] Canvas bento grid view

### 📋 NEXT UP
- [ ] Canvas mindmap mode
- [ ] Canvas roadmap mode
- [ ] Document AI (pitch deck generator)
- [ ] Multi-project support
- [ ] Settings page
- [ ] 11 Specialist AI personas

### 🔮 FUTURE
- [ ] Supabase database + real auth
- [ ] Razorpay payments
- [ ] Notifications (in-app + email)
- [ ] Referral system
- [ ] Templates gallery
- [ ] Voice input
- [ ] Team collaboration
- [ ] Mobile app
- [ ] Custom domain
- [ ] Internationalization (multi-language)

---

## THE 9 BELIEFS

01. Your idea isn't bad. Your plan is.
02. Stop pitching your idea to your dog. Pitch it to your Sidekick.
03. Dreams in your head. Specs on the page. Product in the world.
04. Every empire started as a sketch.
05. Confused ideas ship confused products.
06. The gap between dreamers and builders is one document.
07. Sure, build without a plan. We love bankruptcy stories.
08. AI can't sharpen an idea you haven't written down.
09. Your cofounder isn't psychic. Write it down.

---

*This spec is a living document. Updated as Sidekick evolves.*
*Built by Prachi (Pihu), age 14, solo founder.*
*"The pen is in your hand."*