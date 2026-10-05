# Ọjà — mobile app

React Native (Expo) version of the Ọjà shop. Same products, bag, accounts and orders as the website in `../shop`,
same colours, fonts and type scale.

## Run it

```bash
npm install
npm start            # then scan the QR code with Expo Go (iOS Camera / Android Expo Go app)
```

`.env` holds the only setting, the web app's URL (copy `.env.example`):

```
EXPO_PUBLIC_API_URL=https://oja-shop-amber.vercel.app
```

**The server must have the `/api/v1` routes** (branch `feat/mobile-api` of the web repo) — deploy that branch first.
After changing `.env`, restart with `npx expo start --clear` (Metro caches inlined env values).

### Google sign-in with Expo Go

The server redirects back to the app after Google. In production that is `oja://` (trusted by default). Expo Go
uses `exp://…` instead, which the server only trusts if you opt in. On Vercel set
`MOBILE_TRUSTED_ORIGINS=exp://**`, redeploy, and **remove it afterwards**: the session travels in that link, so
only list schemes you control. A development build (`eas build --profile development`) uses `oja://` and needs no
override.

## Scripts

| | |
|---|---|
| `npm start` | dev server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (includes React Compiler rules) |
| `npm test` | Jest (62 tests, incl. a check that our palette equals the web's `globals.css`) |
| `npm run sync:shared` | copy the web's `lib/` (types, validators, pricing…) into `src/lib/` |
| `npm run sync:check` | fail if the copies drifted |

## Structure

See `AGENTS.md` for the rules and `PLAN.md` for the full plan. Learning notes: `docs/learning/`.
