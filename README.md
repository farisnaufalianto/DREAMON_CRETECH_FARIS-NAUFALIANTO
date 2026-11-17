# Faris Naufalianto: Portfolio

A cinematic, interactive portfolio built with **Next.js 16 (App Router, TypeScript)**, **Tailwind CSS v4**, **GSAP + ScrollTrigger**, and a **React Three Fiber** hero that uses the portrait as a 3D card.

## Setup and run

Requirements: Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other scripts:

```bash
npm run build   # production build
npm start       # run the production build
npm run lint    # ESLint
```

> `next/font` downloads Hanken Grotesk from Google Fonts at build time, so the first `npm run dev` / `npm run build` needs an internet connection.

## Your photo

The hero card uses `public/faris.jpg`. **If it is missing, put your photo at `public/faris.jpg`.**
If the file is absent or fails to load, the site does not crash. It shows a coral/navy "FN" placeholder instead.

## Environment variables

Copy `.env.example` to `.env.local` (a ready-made `.env.local` is already included):

```
AUTH_API_URL=https://dummyjson.com/user/login
```

`AUTH_API_URL` is read on the server only (it is never exposed to the browser). If it is not set, the same URL is used as the default.

## Testing the login

1. Click **Login** in the navbar (or in the mobile menu).
2. Click **Use demo account**. This only fills the fields, it does not submit.
3. Press **Log in**. The demo account is the public DummyJSON test user:
   - username: `emilys`
   - password: `emilyspass`
4. The navbar now shows your avatar, first name and a **Logout** button. Refresh the page: you stay logged in (session is restored from httpOnly cookies). **Logout** clears them.

How it works:

- `POST /api/auth/login` validates the input, calls `AUTH_API_URL` (10 s timeout) and stores `accessToken` / `refreshToken` in **httpOnly** cookies (`Secure` in production, `SameSite=Lax`, 1 hour). The browser only receives `id, username, firstName, lastName, email, image`. Tokens never reach client JavaScript.
- `GET /api/auth/session` returns `{ authenticated, user? }` from the cookies.
- `POST /api/auth/logout` clears the cookies.
- Status codes: `400` invalid input, `401` invalid credentials, `502` upstream failure.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On https://vercel.com, click **Add New… → Project** and import the repository (the Next.js preset is detected automatically).
3. Under **Environment Variables**, add `AUTH_API_URL` = `https://dummyjson.com/user/login`.
4. Click **Deploy**.

## Project structure

```
app/            layout, page, global CSS, API route handlers (app/api/auth/*)
components/     sections, UI pieces, three/ (R3F scene)
hooks/          useAuth, useReveal, useModalA11y, useHeroMode, useMediaQuery
lib/            site.ts (all personal data), auth helpers, GSAP setup
public/         faris.jpg
```

All personal content (name, links, texts, skills, projects) lives in `lib/site.ts`.

## Notes

- Reduced motion is respected: entrance/scroll animations, the custom cursor and the pinned horizontal projects section are disabled.
- On touch devices and small screens the hero shows a static, gently floating portrait instead of the 3D scene. The same 2D card (with a CSS tilt) is used when WebGL is unavailable.
- The 3D scene pauses rendering while the hero is out of view.
