import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // ✅ 서비스 점검 모드 확인
  if (process.env.MAINTENANCE_MODE === "true") {
    return NextResponse.json(
      { message: "서비스 점검 중입니다." },
      { status: 503 }
    );
  }

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

  if (data.status === "error" && data.message?.includes("quota")) {
    return NextResponse.json({ message: "API 소진됨" }, { status: 429 });
  }

  return NextResponse.json(data.results || []);
}
