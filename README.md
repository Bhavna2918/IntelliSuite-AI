# IntelliSuite AI

IntelliSuite AI is a premium, enterprise-grade AI SaaS platform offering a comprehensive suite of tools for content creation, image processing, document analysis, and code generation. Designed with a stunning, highly responsive glassmorphic UI, it delivers a frictionless experience for modern professionals and creators.

## 🚀 Features

The platform provides 9 meticulously crafted AI tools:

- 💬 **AI Chat**: Brainstorm ideas, solve complex problems, and get answers instantly with an advanced conversational AI.
- 📝 **Write Article**: Draft high-quality, SEO-optimized articles and blog posts in seconds.
- 🏷️ **Blog Titles**: Generate catchy, engaging titles for your content to maximize reach.
- 🎨 **AI Image Generation**: Create stunning, professional-grade visuals from simple text descriptions.
- 🖼️ **Background Remover**: Extract subjects instantly with high precision using our advanced AI vision model.
- ✂️ **Object Remover**: Clean up unwanted elements and photobombers effortlessly with AI magic.
- 📄 **Resume Analyzer**: Get ATS scoring and smart formatting tips to land your dream job faster.
- 📚 **PDF Summarizer**: Extract key points, summaries, and action items from lengthy documents instantly.
- 💻 **Code Generator**: Write, debug, and refactor code using an advanced AI programming assistant.

## 💻 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (with custom design system & tokens)
- Framer Motion (for premium micro-interactions and transitions)
- Clerk (Authentication)
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- MongoDB (Database)
- Groq API (`llama-3.1-8b-instant`) for fast, robust text generation
- Together AI / Replicate (for Image processing tasks)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/IntelliSuite_AI.git
   cd IntelliSuite_AI
   ```

2. **Install dependencies**
   ```bash
   # Terminal 1: Backend
   cd server
   npm install

   # Terminal 2: Frontend
   cd client
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the `client` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   VITE_BASE_URL=http://localhost:5000
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   CLERK_SECRET_KEY=your_clerk_secret
   GROQ_API_KEY=your_groq_key
   ```

4. **Run the application**
   ```bash
   # Terminal 1 (server)
   npm run dev

   # Terminal 2 (client)
   npm run dev
   ```

## 🎨 Design System

IntelliSuite AI features a meticulously crafted "Pro Developer" aesthetic:
- **Glassmorphism**: Frosted glass panels seamlessly overlaid on a deep navy space background.
- **Dynamic Theming**: Support for dark and light modes with smooth transitions.
- **Micro-interactions**: Hover effects, soft glowing borders, and elegant page transitions via Framer Motion.
- **Consistent Layout**: A unified architecture mapping every tool to the exact same premium visual identity.

---
*Empowering creators and professionals through advanced Artificial Intelligence.*
