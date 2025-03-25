export async function fetchNews(category: string = "top") {
  const ErrorMessage = "API를 전부 소진했습니다";

  const res = await fetch(`/api/news?category=${category}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [ErrorMessage];
}
