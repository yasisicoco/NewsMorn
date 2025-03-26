export async function fetchNews(category: string = "top") {
  try {
    const res = await fetch(`/api/news?category=${category}`);

    if (res.status === 503) {
      return ["서비스 점검 중입니다"];
    }

    if (res.status === 429) {
      return ["API를 전부 소진했습니다"];
    }

    const data = await res.json();

    return Array.isArray(data) ? data : ["뉴스 데이터를 불러오지 못했습니다"];
  } catch (e) {
    if (e instanceof Error) {
      console.error("Fetch error:", e.message);
    } else {
      console.error("Unknown fetch error:", e);
    }

    return ["알 수 없는 오류가 발생했습니다"];
  }
}
