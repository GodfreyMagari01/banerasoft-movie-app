# BaneraSoft Movie App

BaneraSoft Movie App is a simple movie streaming interface built with React and the TMDb (The Movie Database) API. Users can browse trending and popular films, search and filter by various criteria, build a personal watchlist, and view statistics about their movie habits. Authentication is handled via [Clerk](https://clerk.com/).

## Key Features

**Landing Page**  
A welcoming hero section introduces the app and displays a selection of trending movies fetched from TMDb. Visitors are encouraged to sign up to start building their watchlist.

**Authentication**  
Clerk is integrated to provide sign‑in, sign‑up, and user profile management. Unauthenticated visitors can browse movies, but must sign in to access personalized features.

**Movie Catalogue**  
Search by title or keyword, filter by genre, release year, and minimum rating. Sort by popularity, release date, or rating and paginate through results. Movies are displayed as cards showing the poster, title, year, and rating, with a button to add or remove them from your watchlist.

**Dashboard**  
Once signed in, the dashboard summarizes your activity, showing the number of movies browsed, watchlist size, and a bar chart that displays your watchlist distribution by genre. It also shows a sortable table of recent trending or popular movies, with a button to view more.

**Watchlist Management**  
Add movies to your watchlist from anywhere in the app. The watchlist is stored locally in the browser, so it persists between sessions. A watchlist count is displayed on the dashboard.

**Settings Page**  
A simple settings page contains a logout button with confirmation. Additional settings may be added in the future.

## Project Structure

```
movie-app
  public
  src
    components         (Reusable UI components such as NavBar and MovieCard)
    context            (React context for watchlist state)
    pages              (Top level pages: Landing, Movies, Dashboard, Settings)
    services           (API wrappers for TMDb service)
    App.jsx            (Route definitions and authentication guards)
    main.jsx           (Application entry point, sets up providers)
    index.css          (Global styles)
  .env.example         (Environment variable template)
  README.md            (Project documentation)
  package.json
```

## Getting Started

Clone the repository  
`git clone <your-fork-url>`  
`cd movie-app`

Install dependencies  
`npm install`

Configure environment variables  
Copy `.env.example` to `.env` and fill in your TMDb API key and Clerk publishable key:

```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

You can obtain a TMDb API key by creating an account at [themoviedb.org](https://www.themoviedb.org/) and generating an API key in your account settings.  
Create a free application at [clerk.com](https://clerk.com/) and copy the publishable key from the dashboard.

Run the development server  
`npm run dev`  
The app will be available at [http://localhost:5173/](http://localhost:5173/). Sign up with Clerk to access the dashboard and watchlist features.

Build for production  
`npm run build`  
The compiled site will be output to the `dist` directory.

## External Libraries and Tools

- React – Front‑end library for building the user interface
- Vite – Fast development server and production build tooling
- @clerk/clerk-react – Authentication and user management
- React Router DOM – Client‑side routing between pages
- Axios – HTTP client for calling the TMDb API
- Material‑UI (MUI) – UI component library for navigation, cards, tables, forms, and layout
- Recharts – Charting library used for the dashboard’s genre distribution bar chart

## Known Issues and Limitations

**API quotas:** TMDb enforces rate limiting. Heavy use of the search or discover endpoints may hit the quota. Consider caching results or implementing exponential backoff.  
**Local watchlist storage:** The watchlist and browse counter are stored in localStorage and are not synced across devices or browsers. A backend would be needed for syncing data across sessions and devices.