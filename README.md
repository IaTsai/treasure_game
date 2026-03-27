# Treasure Hunt Game

An interactive browser game built with React where players click on treasure chests to find hidden treasure.

## Gameplay

- 3 treasure chests are presented — one contains treasure, the others contain skeletons
- Treasure: **+$100** | Skeleton: **-$50**
- The game ends when the treasure is found or all chests are opened
- Results: **Win** / **Tie** / **Loss** based on final score

## Features

- User authentication (register / login) with JWT sessions
- Guest mode — play without an account (scores are not saved)
- Score history and stats for registered users
- Sound effects and chest animations
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Vite + React 18 + TypeScript, Tailwind CSS v4, Framer Motion
- **Backend**: Express.js + better-sqlite3 + JWT
- **Deployment**: Vercel (serverless) / GitHub Pages (static)

## Getting Started

```bash
npm install
cd server && npm install
cd ..
npm run dev
```

This starts both the frontend (port 3000) and backend (port 3001).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend |
| `npm run dev:client` | Start Vite dev server only |
| `npm run dev:server` | Start Express backend only |
| `npm run build` | Production build to `build/` |

## Deployment

### Vercel

```bash
vercel --yes       # preview
vercel --prod      # production
```

> Note: SQLite on Vercel uses `/tmp`, data resets on cold start.

### GitHub Pages

The GitHub Pages deployment serves the frontend as a static site. Since there is no backend, only Guest mode is functional.
