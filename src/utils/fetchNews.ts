// export async function fetchNews(category: string = "general") {
//   const res = await fetch(
//     `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEXT_PUBLIC_NEWSAPI_KEY}`
//   );
//   const data = await res.json();
//   console.log(data);
//   return data.articles || [];
// }

export async function fetchNews(category: string = "top") {
  const res = await fetch(`/api/news?category=${category}`);
  const data = await res.json();
  return data || [];
}
