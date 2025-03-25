export async function fetchNews(category: string = "top") {
  const res = await fetch(`/api/news?category=${category}`);
  const data = await res.json();
  return data || [];
}
