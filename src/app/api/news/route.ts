import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category") || "top";
  const apiKey = process.env.NEWSDATA_IO_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  const res = await fetch(
    `https://newsdata.io/api/1/latest?country=kr&category=${category}&apikey=${apiKey}`
  );
  const data = await res.json();

  return NextResponse.json(data.results || []);
}
