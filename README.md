# TrackHire

TrackHire is a React/Vite job application tracker with an Express API, MongoDB, and Gemini-powered follow-up email generation.

## Run locally

1. Install the client and server dependencies:

   ```sh
   npm --prefix client install
   npm --prefix server install
   ```

2. Create `server/.env` with:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_long_random_secret
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```

3. Start the API and frontend in separate terminals:

   ```sh
   npm --prefix server start
   npm --prefix client run dev
   ```

The Vite development server proxies `/api` requests to the local Express server.

## Deploy to Vercel

Deploy the `TrackHire_SEM2` repository root as one Vercel project. The root `vercel.json` declares two Vercel services: the Vite frontend rooted at `client` and the Express backend rooted at `server`. Requests under `/api/*` are rewritten to the Express service; all other paths are rewritten to the frontend service.

In the Vercel project settings, add these environment variables for Production (and Preview if needed):

- `MONGO_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`

Do not add secrets to `VITE_` variables or commit `.env` files. Configure MongoDB Atlas network access for the deployed application and ensure the Gemini API key/model are enabled for your account.

Applications store only the resume filename. The selected PDF itself is not uploaded or persisted.
