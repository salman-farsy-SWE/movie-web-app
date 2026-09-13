# 🎬 MovieTrails — Movie & TV Discovery Web App

Welcome to **MovieTrails**! 👋 A modern, smooth, and friendly movie and TV show exploration app built with **Next.js 16**, **React 19**, **Tailwind CSS**, and powered by the **TMDB (The Movie Database) API**.

Whether you're looking for what's trending tonight, diving deep into actor filmographies, filtering movies by your favorite genres, or organizing your personal watchlist — MovieTrails has you covered!

---

## 📸 App Preview & Demos

<div align="center">
  <img src="./_assets/Home%20Page.png" alt="MovieTrails Home Page" width="100%" />
</div>

---

## 🎯 What Makes MovieTrails Special?

- ⚡ **Fast & Responsive**: Built with Next.js App Router for quick page loads and smooth browsing on mobile, tablet, and desktop.
- 🍿 **All-in-One Entertainment Hub**: Explore movies, TV shows, cast details, trailers, and reviews in one clean interface.
- 🔄 **Direct TMDB Sync**: Log in with your TMDB account to manage your personal watchlist, favorites, custom lists, and ratings in real-time.
- 🎨 **Polished & Accessible Design**: Beautiful modern UI with dark mode support, smooth animations, and intuitive navigation.

---

## ✨ Features Tour

### 1. 🏠 Home & Discovery
Catch the latest trending movies and popular TV shows right on the homepage with an interactive hero carousel and curated lists.

<div align="center">
  <img src="./_assets/Home%20Page.png" alt="Home Page Preview" width="85%" />
</div>

---

### 2. 🎬 Rich Movie & TV Show Details
Get everything you need to know before hitting play: plot summaries, release dates, genres, budgets, cast & crew lists, trailers, and tailored recommendations.

| 🎬 Movie Details | 📺 TV Show Details |
| :---: | :---: |
| <img src="./_assets/Movie%20Detail%20Page.png" alt="Movie Details" width="100%" /> | <img src="./_assets/TV%20Shows%20Detail%20Page.png" alt="TV Show Details" width="100%" /> |

---

### 3. 🔍 Smart Search & Easy Filtering
Looking for something specific? Use the instant search bar or filter collections by genre, release year, rating, or popularity to find your next favorite watch.

| 🔍 Search with Filters | 🏷️ Genre Explorer |
| :---: | :---: |
| <img src="./_assets/Search%20Page%20with%20Filter%20Dropdown.png" alt="Search with Filters" width="100%" /> | <img src="./_assets/Genre%20Page%20with%20Filter%20Dropdown.png" alt="Genre Explorer" width="100%" /> |

| 📽️ Movies Catalog | 🏆 Top Rated Library |
| :---: | :---: |
| <img src="./_assets/Movies%20Page%20with%20Filter%20Dropdown.png" alt="Movies Catalog" width="100%" /> | <img src="./_assets/Top%20Rated%20Page%20with%20Filter%20Dropdown.png" alt="Top Rated Library" width="100%" /> |

---

### 4. 🌟 Actor & Creator Profiles
Discover actor biographies, birthdays, places of birth, and browse their entire acting and production history.

| 👤 Person Detail Page | 🔥 Trending People |
| :---: | :---: |
| <img src="./_assets/Person%20Detail%20Page.png" alt="Person Details" width="100%" /> | <img src="./_assets/Trending%20Persons%20Page.png" alt="Trending People" width="100%" /> |

---

### 5. 💖 Watchlists, Favorites & Ratings
Sign in with your TMDB account to save movies you want to watch later, mark your all-time favorites, rate titles, and view your profile stats.

| 📌 Watchlist | ❤️ Favorites |
| :---: | :---: |
| <img src="./_assets/Watchlist%20Page%20with%20Filter%20Dropdown.png" alt="Watchlist" width="100%" /> | <img src="./_assets/Favorite%20Page%20with%20Filter%20Dropdown.png" alt="Favorites" width="100%" /> |

| ⭐ User Ratings | 👤 Profile Overview |
| :---: | :---: |
| <img src="./_assets/Rating%20Page%20with%20Filter%20Dropdown.png" alt="User Ratings" width="100%" /> | <img src="./_assets/Profile%20Page.png" alt="Profile" width="100%" /> |

---

## 🛠️ Built With

- **[Next.js 16](https://nextjs.org/)** — Fast React framework with App Router and Server Actions
- **[React 19](https://react.dev/)** — Modern UI components and hooks
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe, reliable codebase
- **[Tailwind CSS](https://tailwindcss.com/)** — Clean, responsive utility styling
- **[Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)** — Accessible primitives and icons
- **[Zustand](https://zustand-demo.pmnd.rs/)** — Lightweight client state management
- **[Framer Motion](https://www.framer.com/motion/) & [Embla Carousel](https://www.embla-carousel.com/)** — Smooth animations and touch-friendly carousels
- **[TMDB API](https://developer.themoviedb.org/docs)** — Global movie and television database

---

## 🚀 How to Run Locally

Getting MovieTrails running on your local machine takes just a couple of minutes!

### Step 1: Clone the Project
```bash
git clone https://github.com/salman-farsy-SWE/movie-web-app.git
cd movie-web-app
```

### Step 2: Install Packages
```bash
npm install
```

### Step 3: Set Up Your TMDB API Keys
1. If you don't have an account yet, create a free one on [The Movie Database (TMDB)](https://www.themoviedb.org/).
2. Head over to **Settings > API** to generate your free API key.
3. In your project root, make a copy of `.env.example` named `.env.local`:

```bash
cp .env.example .env.local
```

4. Open `.env.local` and paste in your keys:

```env
TMDB_ACCESS_TOKEN=your_tmdb_read_access_token_here
TMDB_API_KEY=your_tmdb_api_key_v3_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Start the App!
```bash
npm run dev
```

Now open [http://localhost:3000](http://localhost:3000) in your browser and enjoy exploring! 🎉

> 💡 **Friendly tip for Windows users**:
> If you notice that changes aren't auto-refreshing in your browser, simply run `npm run dev:polling` instead.

---

## 📂 Quick Folder Tour

Here's a friendly roadmap to help you navigate the codebase:

```text
movie-web-app/
├── _assets/          # Screenshots and demo images for the README
├── public/           # Static icons and logos
├── src/
│   ├── actions/      # Server actions for TMDB authentication & collections
│   ├── app/          # App Router pages (Home, Movies, TV, Details, Search, Profile)
│   ├── components/   # UI building blocks (Navbar, Cards, Modals, Filters, Carousels)
│   ├── contexts/     # App-level contexts (Themes, state wrappers)
│   ├── hooks/        # Custom React hooks (Debounce, screen size helpers)
│   ├── lib/          # TMDB API client functions and utility helpers
│   ├── stores/       # Zustand state stores
│   └── types/        # TypeScript interfaces and data models
├── .env.example      # Example environment variables
└── package.json      # Project dependencies and scripts
```

---

## 🤝 Contributing & Feedback

Got an idea or found a bug? Contributions, issues, and feature suggestions are always welcome! Feel free to open an issue or submit a pull request.

---

## 📜 Acknowledgements & Disclaimer

- Movie and TV show information, images, and metadata are provided by **[The Movie Database (TMDB)](https://www.themoviedb.org/)**.
- *This product uses the TMDB API but is not endorsed or certified by TMDB.*

---

Enjoy using MovieTrails! 🍿
