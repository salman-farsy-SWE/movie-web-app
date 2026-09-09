import { NextResponse } from "next/server";
import { searchMoviesAndTv, searchPersons } from "@/lib/tmdb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all";

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    if (type === "person" || type === "persons") {
      const result = await searchPersons(query, 1, 6);
      return NextResponse.json(result?.persons?.slice(0, 6) ?? []);
    }

    const result = await searchMoviesAndTv(query, 1, 6);
    return NextResponse.json(result?.movies?.slice(0, 6) ?? []);
  } catch (error) {
    console.error("API search error:", error);
    return NextResponse.json([]);
  }
}
