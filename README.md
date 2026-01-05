# Vlands - Small Backend

This repository contains a small Express + Mongoose backend to provide dynamic data for the Vlands frontend (stats, plot details and watchlist signup).

Files added:

- `server.js` - Express server and API endpoints
- `package.json` - npm scripts and dependencies
- `.env.example` - environment variables example

APIs provided:

- GET `/api/landing/stats` - returns stats, plotDetails and watchlistCount
- POST `/api/landing/stats` - update stats/plotDetails/watchlistCount (no auth in demo)
- POST `/api/watchlist/signup` - body: `{ fullName, email, mobile }` -> saves user and increments watchlistCount

Run locally:

1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The server serves static files from the project root, so you can visit `http://localhost:3000` to open the frontend and the API will be available at `/api/...`.

Notes:
- For production, add authentication to admin endpoints and harden CORS and input validation.
- If you prefer to run frontend separately, you can still use these API endpoints by allowing CORS from your frontend origin.
