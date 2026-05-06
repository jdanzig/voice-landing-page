# ElevenLabs Growth Prototype: Voice Landing Page Generator

A product-led growth prototype for turning a project idea into a polished, voice-enhanced landing page in under a minute.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local`:

```bash
ELEVENLABS_API_KEY=your_api_key_here
```

Without an ElevenLabs key, the app still generates copy and preview pages, and the preview includes a browser speech fallback so the activation flow can be demoed.

## What it demonstrates

- Fast creator/startup input form
- Conversion-oriented landing page copy generation
- ElevenLabs text-to-speech generation with selectable voices
- Shareable preview URLs at `/preview/[id]`
- Lightweight analytics at `/dashboard/[id]`
- Local JSON persistence and cached audio files
