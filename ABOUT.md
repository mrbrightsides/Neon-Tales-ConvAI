# Neon Tales ConvAI

## Inspiration

Growing up in Indonesia, we've seen countless children glued to screens — watching passive content that doesn't engage their minds or help them learn. Meanwhile, parents struggle to find affordable, effective ways to teach their children English and instill moral values.

The problem? Most educational apps are one-way streets: the app talks, kids listen. There's no conversation, no adaptation, no real interaction.

We asked ourselves: What if kids could actually talk to their stories?
What if AI could respond naturally, adapt the narrative in real-time, and create truly personalized learning experiences?

That’s when we discovered the power of combining Google Gemini’s reasoning with ElevenLabs’ conversational AI. We realized we could build something revolutionary: a platform where children don’t just consume stories — they co-create them through natural conversation.

Neon Tales ConvAI was born from this vision: making education accessible, engaging, and conversational for Indonesia’s 50 million children aged 3–12.

---

## What It Does

Neon Tales ConvAI is a voice-first, AI-powered storytelling platform that enables children to have natural conversations with an AI storyteller in Indonesian or English.

### Core Features
🎤 Speech-to-Speech Interaction

- Kids speak naturally, and the AI responds with voice

- No reading required — perfect for ages 3–12

- Real-time conversation flow powered by ElevenLabs Conversational Agent

🧠 Intelligent Story Generation

- Google Gemini creates age-appropriate stories on the fly

- Stories adapt based on children’s choices and responses

- Moral lessons embedded naturally (kindness, honesty, courage, etc.)

🌏 Bilingual Support

- Seamless switching between Indonesian and English

- Helps Indonesian children learn English through immersive storytelling

- Natural pronunciation from ElevenLabs voice synthesis

🎨 Interactive Story Branching

- Children make choices that affect story outcomes

- Multiple categories: Adventure, Fantasy, Science, Nature, Friendship, Mystery, and more

- Every playthrough is unique

🎯 Age-Appropriate Content

- Three age groups:

  - Toddlers (3–5)

  - Kids (6–8)

  - Preteens (9–12)

- Gemini safety filters ensure content appropriateness

- Vertex AI deployment ensures scalable and reliable performance

✨ Immersive Experience

- 3D neon-themed interface using Three.js

- Audio visualizers during conversation

- Fully mobile-responsive — works on any device

---

## How We Built It

### Technology Stack
AI & Voice

- Google Gemini API → Story generation, reasoning, and branching logic

- Vertex AI → Scalable cloud deployment and model serving

- ElevenLabs Conversational Agent → Real-time speech-to-speech interaction

- ElevenLabs Text-to-Speech → High-quality voice narration

- Web Speech API → Browser-based speech recognition

Frontend

- Next.js 15 → Modern React framework (App Router)

- TypeScript → 100% type-safe codebase

- Three.js → 3D graphics and neon environments

- Tailwind CSS → Responsive, mobile-first design

- Animate.css → Smooth UI transitions

Architecture

- API Routes → Secure server-side API handling

- Proxy Pattern → Manage CORS and external APIs

- Type-Safe Interfaces → User, Story, Chapter, Achievement models

- Real-time Audio Processing → ElevenLabs streaming + visualization

Development Process

1. Data Structure Design

2. Gemini & ElevenLabs API Integration

3. Voice Pipeline (STT → Reasoning → TTS)

4. Child-Friendly UI/UX Design

5. Cross-device Testing

---

## Challenges We Ran Into
Real-Time Conversation Latency

Challenge: Noticeable delay across STT → Gemini → TTS pipeline.
Solution:

- Audio visualizers during processing

- Optimized API calls

- Cached common story elements

Age-Appropriate Content Filtering

Challenge: Ensuring safety without killing creativity.
Solution:

- Detailed prompt engineering by age group

- Explicit moral constraints

- Content validation before narration

Bilingual Context Switching

Challenge: Switching languages mid-story.
Solution:

- Stateful conversation management

- Gemini multilingual context preservation

Mobile Audio Playback

Challenge: Autoplay restrictions on mobile browsers.
Solution:

- User-triggered audio start

- Progressive loading

- Visual readiness indicators

ElevenLabs Agent Session Management

Challenge: Handling disconnects gracefully.
Solution:

- Automatic reconnection

- Conversation history preservation

- Fallback to direct TTS

---

## Accomplishments We’re Proud Of

🎤 True Speech-to-Speech Conversation

- Not a TTS app — a real conversational experience.

🧠 Advanced AI Integration

- Gemini reasoning + ElevenLabs voice = living AI storyteller.

🌏 Real Impact Potential

- Designed for 50M Indonesian children, addressing real education gaps.

💻 Production-Quality Code

- Strict TypeScript, scalable architecture, robust error handling.

🎨 Child-Friendly Design

- Usable by 3-year-olds, engaging for 12-year-olds.

📱 Cross-Platform Accessibility

- No app store required — works everywhere.

---

## What We Learned

1. Technical Learnings

- Conversational AI is complex

- Prompt engineering is an art

- Voice UX requires visual feedback

2. Domain Learnings

- Children learn best through interaction

- Bilingual education gaps start early

3. Platform Learnings

- Google Cloud + ElevenLabs unlock emergent capabilities

- Gemini reasoning + ElevenLabs voice

- Vertex AI scale + ElevenLabs quality

---

## What’s Next for Neon Tales ConvAI
1. Short-Term (0–3 Months)

- 50+ story templates

- Indonesian folklore content

- STEM-focused stories

- Parent dashboard

- Gamification & achievements

2. Mid-Term (6–12 Months)

- Regional languages (Javanese, Sundanese)

- School pilots

- Offline mode for rural areas

3. Long-Term (1–2 Years)

- Community-created stories

- Personalized learning paths

- Global expansion

- Academic research partnerships

---

## Vision

We envision Neon Tales ConvAI as the world’s first conversational AI education platform that makes quality learning accessible — regardless of literacy level, location, or income.

We’re not just building an app.
We’re democratizing education through conversation. 🌟

---

## Projected Impact Metrics

🎯 50M+ Indonesian children (target users)

🌏 270M+ population reach

📈 Growing demand for affordable education

💰 $0 vs $10–50/hour tutoring

📱 96% smartphone penetration
