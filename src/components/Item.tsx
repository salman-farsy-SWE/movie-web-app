"use client";

import { TableItem } from "@/types/items";
import { TableRow } from "./TableRow";

const gridClass =
  "grid xl:grid-cols-[270px_270px_270px_270px_270px_40px] lg:grid-cols-[230px_230px_230px_230px_230px_40px] md:grid-cols-[200px_200px_200px_200px_200px_30px] sm:grid-cols-[210px_210px_210px_210px_20px] grid-cols-[160px_160px_160px_160px_10px] items-center mb-[51px] font-inter md:font-medium font-normal xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[17px] text-[16px] text-light-table-heading-font";

const sampleTableData: TableItem[] = [
  {
    image: "/assets/card-sand.jpg",
    name: "Avengers: Endgame Avengers: Endgame",
    rating: 8.5,
    yourRating: 9.0,
    // media: "Movie",
    released: "2019"
  },
  {
    image: "/assets/card-sand.jpg",
    name: "The Dark Knight",
    rating: 9.0,
    yourRating: 9.5,
    // media: "Movie",
    released: "2008"
  },
  {
    image: "/assets/card-sand.jpg",
    name: "Inception",
    rating: 8.8,
    yourRating: 8.5,
    // media: "Movie",
    released: "2010"
  },
  {
    image: "/assets/card-sand.jpg",
    name: "Breaking Bad",
    rating: 9.5,
    yourRating: 9.7,
    // media: "TV Show",
    released: "2008"
  },
  {
    image: "/assets/card-sand.jpg",
    name: "The Shawshank Redemption",
    rating: 9.3,
    yourRating: 9.2,
    // media: "Movie",
    released: "1994"
  }
];

interface FavoriteItemsProps {
  headers: string[];
  //   data: TableItem[];
}

export function Item({ headers }: FavoriteItemsProps) {
  return (
    <div className="container-1440 xl:mt-[85px] lg:mt-[83px] md:mt-[75px] sm:mt-[65px] mt-[60px] flex flex-col items-center overflow-auto">
      <div className={`${gridClass}`}>
        {headers.map((header, i) => (
          <div
            key={i}
            className={`text-center ${i === 3 ? "md:block hidden" : ""}`}
          >
            {header}
          </div>
        ))}
        <div />
      </div>

      <div className="flex flex-col">
        {sampleTableData.map((item, i) => (
          <TableRow
            key={i}
            item={item}
            isFirst={i === 0}
            isLast={i === sampleTableData.length - 1}
          />
        ))}
      </div>
    </div>
  );
}