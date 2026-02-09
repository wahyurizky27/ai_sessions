# AI Conversation Sessions

A web application for managing AI-powered conversation sessions built with Next.js, Prisma, and Google Gemini.

## Features

- 📝 Create and manage conversation sessions
- 💬 Real-time AI chat powered by Gemini
- 🌙 Dark mode support
- 📊 Error monitoring simulation (Sentry-like)
- 🧪 Configurable AI failure simulation for testing
- ✅ Unit tests with Vitest

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, Tailwind CSS
- **Database**: Prisma + SQLite
- **AI Provider**: Google Gemini (free tier)
- **Testing**: Vitest

## Prerequisites

- Node.js 18+ (20+ recommended)
- npm, yarn, or pnpm
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create `.env` for Prisma:

```bash
DATABASE_URL="file:./dev.db"
```

Create `.env.local` for runtime variables:

```bash
GEMINI_API_KEY=your_api_key_here
AI_FAILURE_RATE=0.2
AI_MIN_DELAY_MS=800
AI_MAX_DELAY_MS=1600
```

**Environment Variables:**

- `GEMINI_API_KEY`: Your Google Gemini API key
- `AI_FAILURE_RATE`: Probability of simulated failures (0.0-1.0, default: 0.2)
- `AI_MIN_DELAY_MS`: Minimum AI response delay in milliseconds
- `AI_MAX_DELAY_MS`: Maximum AI response delay in milliseconds

### 3. Initialize Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Navigate to `/sessions` to view all conversation sessions
2. Click **"Create Session"** and enter a title
3. Click **"Open"** on any session to view the conversation
4. Type a message and press **Send** to chat with the AI
5. Watch for simulated delays and occasional failures (based on `AI_FAILURE_RATE`)

## Testing

Run unit tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npx vitest
```

## Error Monitoring

The application includes a simulated error monitoring system (similar to Sentry):

- ✅ Validation errors (400) are treated as expected
- ❌ Provider failures (502) and unexpected errors are captured
- 📋 Errors are logged to the server console with `[SentryLike]` prefix

## Dark Mode

Dark mode is implemented using Tailwind's class strategy:

- Toggle button in the UI
- Preference saved to `localStorage`
- Persists across sessions

## Configuration Tips

### Force AI Failures (for testing)

```bash
AI_FAILURE_RATE=1.0  # 100% failure rate
```

### Disable AI Failures

```bash
AI_FAILURE_RATE=0.0  # Always succeed
```

_Remember to restart the dev server after changing `.env.local`_

## Troubleshooting

### "Missing required environment variable: DATABASE_URL"

Ensure you have a `.env` file (not `.env.local`) with:

```bash
DATABASE_URL="file:./dev.db"
```

Then run:

```bash
npx prisma migrate dev
```

### "params is a Promise" Error

If using Next.js 15+, update dynamic routes to await params:

```typescript
const { id } = await params;
```

### "Message cannot be empty" (400)

The API validates messages. Ensure your UI prevents empty submissions:

```typescript
if (!text.trim()) return;
```

### Dark Mode Not Working

1. Verify `tailwind.config.js` has `darkMode: "class"`
2. Check that your components use `dark:` class variants
3. Inspect `document.documentElement.classList` for `dark` class

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── sessions/         # Session pages
│   └── layout.tsx        # Root layout
├── prisma/
│   └── schema.prisma     # Database schema
├── lib/                  # Utilities and services
└── __tests__/           # Test files
```

## License

MIT

## Contributing

Pull requests are welcome! Please open an issue first to discuss proposed changes.
