# RecipeBox — Frontend

A full stack personal recipe management app where users can save, organize, and share their favorite recipes. This is the React client, deployed on **Vercel**.

**Live demo:** https://recipebox-frontend-eta.vercel.app/
**Backend repo/folder:** https://github.com/Azona001/recipebox-backend

## Features

- 🔐 **Auth0 authentication** — secure login/signup with session handling and route guards
- ♾️ **Infinite scroll** — `IntersectionObserver` with a sentinel element, separate `isLoading` / `isFetchingMore` states
- 🔍 **Debounced search** — custom `useDebounce` hook (built from scratch, no lodash) driving backend search
- ❤️ **Favorites** — toggleable favorites with a custom SVG gradient heart icon and dashboard filter
- 🔗 **Recipe sharing** — generate public share links viewable without an account
- 🖨️ **Print to PDF** — print-optimized recipe view using `window.print()` and `@media print` CSS
- 💀 **Skeleton loading** — MUI Skeleton cards matched to real card layout to avoid layout shift
- 🔔 **Toast notifications** — success/error feedback via `react-hot-toast`
- 🌗 **Dark/light theme** support
- 📱 **PWA support** — installable, with service worker and web manifest
- 💳 **Pro plan upgrade** — Stripe-powered upgrade flow (`UpgradeToPro`)

## Tech Stack

| Category      | Tech                                     |
| ------------- | ---------------------------------------- |
| Framework     | React                                    |
| UI            | Material UI (MUI), custom CSS            |
| Auth          | Auth0 React SDK                          |
| Notifications | react-hot-toast                          |
| Payments      | Stripe                                   |
| Images        | Cloudinary (uploads handled via backend) |
| Deployment    | Vercel                                   |

## Getting Started

### Prerequisites

- Node.js 18+
- The [RecipeBox backend](../backend) running locally or deployed

### Installation

```bash
# Clone the repo and move into the frontend folder
cd frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the frontend root:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AUTH0_DOMAIN=your-tenant.us.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id
REACT_APP_AUTH0_AUDIENCE=your_api_audience
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

> Adjust variable names/prefixes to match your setup (e.g. `VITE_` if using Vite).

### Running Locally

```bash
npm start
```

The app runs at `http://localhost:3000` by default.

## Project Structure

```
frontend/
├── public/              # Static assets, manifest.json, service worker
├── src/
│   ├── components/      # Reusable UI (RecipeCard, UpgradeToPro, etc.)
|   ├── context/         # React context providers (RecipeProvider, CategoryProvider, ThemeProvider)
│   ├── pages/           # Route-level pages (Dashboard, SharedRecipe, etc.)
│   ├── hooks/           # Custom hooks (useDebounce)
│   ├── App.js
│   └── index.js
└── package.json
```

## Notable Implementation Details

- **`useDebounce` hook** — uses `useRef` to skip the first render, preventing a double fetch on mount.
- **Infinite scroll** — a sentinel `div` observed by `IntersectionObserver`; the backend returns a `hasMore` flag to stop fetching.
- **Print styles** — `@media print` rules hide app chrome and reset transforms so recipes print cleanly.
- **Skeletons** — reuse the existing `card` CSS class for layout so skeletons stay in sync with real cards automatically.

## Deployment

Deployed on Vercel. Push to `main` triggers a production deploy. Remember to set all environment variables in the Vercel dashboard.

## License

MIT — [Your Name]
