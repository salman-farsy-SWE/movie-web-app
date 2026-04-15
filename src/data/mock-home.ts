export interface HeroContent {
  title: string;
  description: string;
  year: string;
  rating: string;
  genres: string[];
  image: string;
}

export interface MovieItem {
  id: string;
  title: string;
  genre: string;
  image: string;
  trailer: string;
}

export interface MovieSection {
  id: string;
  title: string;
  items: MovieItem[];
}

export const heroContents: HeroContent[] = [{
  title: "Interstellar",
  description:
    "They started the war. He will finish it. They started the war. He will finish it. They started the war. He will finish it.",
  year: "2014",
  rating: "8.5",
  genres: ["Action", "Adventure"],
  image: "/assets/image.png",
},
{
  title: "Inception",
  description: "They started the war. He will finish it. They started the war. He will finish it. They started the war. He will finish it.",
  year: "2010",
  rating: "8",
  genres: ["Sci-Fi", "Thriller"],
  image: "/assets/image2.jpg",
}];

const rowItems: MovieItem[] = [
  {
    id: "movie-1",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-sand.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-2",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-3",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-4",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-5",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-6",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-7",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-8",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-9",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-10",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-11",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-12",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-13",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-14",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    id: "movie-15",
    title: "Avengers Endgame",
    genre: "Horror/Fantasy",
    image: "/assets/card-ocean.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

export const movieSections: MovieSection[] = [
  { id: "trending", title: "Trending", items: rowItems },
  {
    id: "top-rated",
    title: "Top Rated",
    items: rowItems,
  },
  { id: "tv-shows", title: "TV Shows", items: rowItems },
  { id: "movies", title: "Movies", items: rowItems },
];
