<div align="center">
  
# 🌟 Neon Tales - AI-Powered Interactive Storytelling for Children

![Three.js](https://img.shields.io/badge/Three.js-3D-000000?style=for-the-badge&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Neon Tales](https://img.shields.io/badge/Neon%20Tales-v1.0.0-blueviolet?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-lightgrey?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-FF6A00?style=for-the-badge&logo=google)
![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Voice%20AI-magenta?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Interactive voice-driven storytelling platform with AI-powered conversations and bilingual support**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started)

<img width="837" height="809" alt="logo" src="https://github.com/user-attachments/assets/29013e26-70d5-49b0-b48c-45f6affdd614" />

</div>

---

## 📖 Overview

Neon Tales is an innovative storytelling application that uses AI to generate engaging, educational, and fun stories for children aged 3-12. With a futuristic neon web3 theme, bilingual support, and gamification features, it makes reading exciting and interactive.

### 🎯 Key Highlights

- 🤖 **AI-Powered**: Generate unlimited unique stories using Perplexity AI
- 🌍 **Bilingual**: Full support for Indonesian 🇮🇩 and English 🇬🇧
- 🏆 **Gamification**: 25+ achievement badges and reading streak tracking
- 🎭 **Character Creator**: Kids can create and customize their own story characters
- 🎙️ **Native TTS**: High-quality text-to-speech with Android native integration
- 📚 **Persistent Library**: Stories never lost with IndexedDB storage
- 👶 **Age-Appropriate**: Content filters for 3-5, 6-8, and 9-12 year olds

---

## ✨ Features

### 🎨 Story Generation
- **9 Story Categories**: Folklore, Myth, Legend, Fable, Fairy Tale, Adventure, Parable, Mystery, Science
- **Age Filters**: Content appropriate for different age groups (3-5, 6-8, 9-12 years)
- **Bilingual Support**: Generate stories in Indonesian or English
- **Story Continuation**: Continue existing stories with AI
- **Character Integration**: Use custom characters in generated stories

### 🏆 Gamification & Engagement
- **25+ Achievement Badges**:
  - 📖 Reading Milestones (First Story, Story Explorer, Story Master, Story Legend)
  - 🔥 Reading Streaks (3-day, 7-day, 30-day streaks)
  - 🌍 Bilingual Achievements
  - 📚 Category-Specific Badges (Folklore Lover, Myth Explorer, etc.)
  - ⭐ Hidden Special Achievements
- **Reading Streak Tracker**: Motivate daily reading habits
- **User Statistics**: Track total stories, favorites, and progress
- **Star Rating System**: Rate stories to help improve content

### 🎭 Character Creator
- Create custom story characters with:
  - Name and description
  - 8 personality types (Kind, Brave, Smart, Funny, Curious, Shy, Creative, Adventurous)
  - Physical appearance details
  - Save and reuse in multiple stories

### 🎙️ Text-to-Speech (TTS)
- **Native Android TTS Integration**: High-quality voice synthesis
- **Web Speech API Fallback**: Works in browsers for testing
- **Language Support**: Indonesian and English voices
- **Speed Presets**: Slow 🐢, Normal 🚶, Fast 🏃, Turbo 🚀
- **Advanced Controls**: Rate, pitch, and volume adjustment
- **No Permissions Required**: TTS works without microphone access

### 📚 Story Library
- **Persistent Storage**: Uses IndexedDB for permanent storage
- **Never Lose Stories**: Survives cache clears
- **Search & Filter**: Find stories by category, age, language
- **Bookmark System**: Mark favorite stories
- **Export & Share**: Copy or share stories via social media

### 📤 Social Sharing
- Share to WhatsApp 💬
- Share to Telegram ✈️
- Share to Twitter/X 🐦
- Share to Facebook 👥
- Copy to clipboard (fallback for WebView restrictions)

### 📖 Reading Experience
- **Progress Bar**: Track reading position
- **Font Size Control**: Adjust text size for comfort
- **Responsive Design**: Works on all screen sizes
- **Mobile-Optimized**: Safe area padding for notches
- **Three.js Background**: Animated neon visual effects

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with [shadcn/ui](https://ui.shadcn.com/) patterns
- **3D Graphics**: [Three.js](https://threejs.org/) for neon background effects
- **Icons**: [Lucide React](https://lucide.dev/)

### AI & Voice
- Story Intelligence: [Google Gemini API](https://aistudio.google.com/api-keys) for story generation & reasoning
- Advanced AI: [Vertex AI](https://cloud.google.com/vertex-ai) for enhanced story logic
- Conversational AI: [ElevenLabs Conversational AI](https://elevenlabs.io/developers) for speech-to-speech interaction
- Voice-First: Real-time conversational interface with natural voice responses
- API Proxy: Next.js API routes for secure external calls

### Features
- Bilingual Support: Seamless switching between Indonesian and English
- Story Branching: Interactive conversational storytelling with moral values
- Age-Appropriate: AI-driven content filtering for children
- Mobile-Responsive: Optimized for touch-first interactions

### Storage & State
- Persistent Storage: IndexedDB (via custom storage manager)
- Fallback Storage: localStorage
- State Management: React hooks (useState, useEffect, useCallback)

### Development Tools
- Package Manager: pnpm/npm
- Code Quality: TypeScript strict mode
- Build Tool: Next.js built-in compiler

---

## 🚀 Getting Started
### Prerequisites
- Node.js 18+
- pnpm or npm
- Google Cloud account (for Gemini & Vertex AI)
- ElevenLabs account (for Conversational AI)

### Installation
1. Clone the repository
bash
```
git clone https://github.com/mrbrightsides/Neon-Tales-ConvAI.git
cd neon-tales
```

2. Install dependencies
bash
```
npm install
# or
pnpm install
```

3. Set up environment variables Create a .env.local file (or hardcode in API routes for quick testing):
  - GOOGLE_GEMINI_API_KEY=your_gemini_key_here
  - ELEVENLABS_API_KEY=your_elevenlabs_key_here
  - ELEVENLABS_AGENT_ID=your_agent_id_here

4. Run development server
bash
```
npm run dev
# or
pnpm dev
```

5. **Open browser**
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

### ✅ Persistent Storage

**Use IndexedDB for Production:**
```typescript
// Better than localStorage for:
// - Larger storage capacity
// - Structured data
// - Better performance
// - Survives cache clears (in most cases)

// Always provide localStorage fallback
```

### ✅ Mobile-First Design

- Touch-friendly button sizes (min 44x44px)
- Safe area padding for notches (`pt-12` on mobile)
- Responsive layouts with Tailwind breakpoints
- Smooth scrolling and animations
- Fast loading with optimized assets

### ✅ Permission Management

**Only Request What You Need:**
- ✅ `INTERNET` - Always needed for web apps
- ❌ `RECORD_AUDIO` - NOT needed for TTS!
- Add others only when actually required

### ✅ Error Handling

- Graceful degradation for unsupported features
- Clear user guidance when features blocked
- Fallback mechanisms for all critical features
- User-friendly error messages (avoid technical jargon)

---

## 🧪 Testing Checklist

### Browser Testing
- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### WebView Testing
- [ ] Android WebView (different versions)
- [ ] iOS WKWebView
- [ ] Feature detection working correctly
- [ ] Native bridges properly detected

### Feature Testing
- [ ] Story generation (all categories)
- [ ] Bilingual support (ID/EN)
- [ ] Age filters working
- [ ] TTS with native Android bridge
- [ ] Achievement unlocking
- [ ] Reading streak tracking
- [ ] Character creator CRUD
- [ ] Story library persistence
- [ ] Social sharing (all platforms)
- [ ] Copy to clipboard
- [ ] Responsive design (all breakpoints)

### Performance Testing
- [ ] Fast initial load
- [ ] Smooth animations
- [ ] No memory leaks
- [ ] IndexedDB operations performant
- [ ] Works on low-end devices

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow TypeScript strict mode guidelines
4. Write clean, documented code
5. Test thoroughly (browser + WebView)
6. Commit with clear messages (`git commit -m 'Add AmazingFeature'`)
7. Push to branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

### Code Style

- Use TypeScript strict mode (no implicit `any`)
- Follow existing component patterns
- Use Tailwind CSS for styling
- Write descriptive variable names
- Add comments for complex logic
- Keep files small and modular

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini & Vertex AI** - For intelligent story generation and reasoning capabilities
- **ElevenLabs** - For revolutionary conversational AI and natural voice interaction
- **Google Cloud Platform** - For robust AI infrastructure
- **Next.js Team** - For the amazing React framework
- **Tailwind CSS** - For utility-first styling
- **Three.js** - For stunning 3D graphics
- **shadcn/ui** - For beautiful UI component patterns
- **Open Source Community** - For invaluable tools and libraries

---

## 📧 Contact & Support

- **Website**: [neontales.elpeef.com](https://neontales.elpeef.com)
- **Issues**: [GitHub Issues](https://github.com/mrbrightsides/Neon-Tales-ConvAI/issues)
- **Email**: khudri@binadarma.ac.id/support@elpeef.com

---

## 🗺️ Roadmap

### Future Features (Potential)
- [ ] Word highlighting during TTS
- [ ] Interactive story choices (Choose Your Own Adventure)
- [ ] Story illustrations with AI image generation
- [ ] Parental dashboard with analytics
- [ ] Reading comprehension quizzes
- [ ] Offline mode with cached stories
- [ ] Dark mode / Night reading mode
- [ ] Web3 integration (NFT story minting on Base)
- [ ] Collaborative storytelling mode
- [ ] Community story sharing

---

<div align="center">

**Made with ❤️ for children and families**

If you find this project helpful, please consider giving it a ⭐!

[Report Bug](https://github.com/mrbrightsides/Neon-Tales-ConvAI/issues) · [Request Feature](https://github.com/mrbrightsides/Neon-Tales-ConvAI/issues)

</div>
