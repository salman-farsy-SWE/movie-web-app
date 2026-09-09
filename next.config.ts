import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        pathname: "/avatar/**",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/avatar/**",
      },
      {
        protocol: "https",
        hostname: "gravatar.com",
        pathname: "/avatar/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/watchlist",
        destination: "/me/watchlist",
        permanent: false,
      },
      {
        source: "/favorite",
        destination: "/me/favorite",
        permanent: false,
      },
      {
        source: "/list",
        destination: "/me/list",
        permanent: false,
      },
      {
        source: "/list/:listId",
        destination: "/me/list/:listId",
        permanent: false,
      },
      {
        source: "/rating",
        destination: "/me/rating",
        permanent: false,
      },
      {
        source: "/profile",
        destination: "/me/profile",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
