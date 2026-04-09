# PulseWire News

PulseWire News is a production-minded mobile news application built with Expo SDK 55, React Native, TypeScript, Expo Router, Zustand, Axios, AsyncStorage caching, text-to-speech, bookmarks, search, AI explain, and bilingual UI support.

## Highlights

- Modern card-based mobile UI with light and dark themes
- Floating theme toggle in the top-right corner
- Horizontal news tabs for Home, For You, Following, News Showcase, India, World, Local, Business, Technology, Entertainment, Sports, Science, and Health
- Real-time search with debounce
- Article detail screen with listen mode, radio mode, bookmark, share, follow-source, and explain actions
- Hindi and English UI/content switching
- AsyncStorage caching and persisted Zustand stores
- Pull to refresh and infinite scrolling
- Demo data fallback when no live API key is configured

## Tech Stack

- Expo SDK 55
- React Native 0.83
- TypeScript
- Expo Router
- Zustand
- Axios
- AsyncStorage
- Expo Speech
- Expo Sharing
- Expo Localization

## Project Structure

```text
app/
components/
constants/
hooks/
services/
store/
types/
utils/
```

## Environment Variables

Create a `.env` file in this project directory using `.env.example` as the template.

```bash
cp .env.example .env
```

Required for live news:

- `EXPO_PUBLIC_GNEWS_API_KEY`

Optional for AI explain in development:

- `EXPO_PUBLIC_OPENAI_API_KEY`
- `EXPO_PUBLIC_OPENAI_MODEL`

Optional demo override:

- `EXPO_PUBLIC_USE_DEMO_DATA=true`

Important:

- `EXPO_PUBLIC_*` values are bundled into the client app.
- The OpenAI key is only appropriate for demos or internal testing.
- For real production use, move AI explain requests behind your own secure backend.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your environment variables:

   ```bash
   cp .env.example .env
   ```

3. Start the Expo app:

   ```bash
   npx expo start
   ```

4. Run on a target:

   ```bash
   npm run ios
   npm run android
   npm run web
   ```

## How the App Works

### News data

- If `EXPO_PUBLIC_GNEWS_API_KEY` is present, the app fetches live headlines from GNews.
- If the key is missing, the app automatically falls back to curated demo articles so the UI still works out of the box.
- Feed responses are cached in AsyncStorage for 15 minutes.

### AI explain

- Without an OpenAI key, PulseWire uses a local summarisation fallback.
- With an OpenAI key, it calls the OpenAI Responses API and returns a 50 to 60 word explanation.

### Personalisation

- `For You` uses recent searches and bookmarked content to infer interest keywords.
- `Following` uses locally followed sources.
- Bookmarks, followed sources, language, theme, and recent searches are persisted with Zustand.

## Scripts

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`
- `npm run typecheck`

## Notes for Beginners

- `services/api/news-repository.ts` is the main place where remote data, cache, and fallback logic are combined.
- `hooks/use-news-feed.ts` is the screen-facing hook that handles loading, refresh, pagination, and errors.
- `store/` contains app-level Zustand stores for preferences, bookmarks, and audio playback state.
- `app/article/[id].tsx` is the detail screen where share, listen, follow, bookmark, and explain actions come together.

## Verification

After installing dependencies, run:

```bash
npm run typecheck
```

If you want stricter linting, you can also add Expo ESLint later with:

```bash
npx expo lint
```
