export type TableItem = {
  id?: string;
  image: string;
  name: string;
  rating: number;
  yourRating?: number;
  media?: string;
  released: string;
}
export * from "./collection";
export * from "./media";
export * from "./shared";