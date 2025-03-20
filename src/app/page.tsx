"use client";

import { useEffect, useState } from "react";
import { fetchNews } from "@/utils/fetchNews";
import { summarizeNews } from "@/utils/summarizeNews";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Article {
  title: string;
  link: string;
  description: string;
  content: string;
  source_name: string;
}

const categories = [
  "top",
  "sports",
  "technology",
  "business",
  "science",
  "entertainment",
  "health",
  "world",
  "politics",
  "environment",
  "food",
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState("top");
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<{ [key: number]: string }>({});
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false); // 🛠️ 다크모드 관련 Hydration 문제 방지

  useEffect(() => {
    setIsClient(true); // 🛠️ 클라이언트에서만 실행되도록 설정
  }, []);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const news = await fetchNews(category);
      console.log("뉴스 데이터:", news);
      setArticles(news);
      setLoading(false);
    }
    loadNews();
  }, [category]); // 카테고리 변경 시만 API 호출

  const handleSummarize = async (index: number, content: string) => {
    if (!content) return;

    const summary = await summarizeNews(content, "short");
    setSummaries((prev) => ({ ...prev, [index]: summary }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {/* 헤더 (정렬 수정) */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          NewsMorn - AI 뉴스 요약
        </h1>
        {/* 🛠️ isClient 추가: 서버에서 hydration mismatch 방지 */}
        {isClient && (
          <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "☀️ 라이트 모드" : "🌙 다크 모드"}
          </Button>
        )}
      </div>

      {/* 네비게이션 바 (Carousel + Card 적용) () (md >= 768) (lg >= 960) */}
      <Carousel className="w-full max-w-2xl mx-auto mt-4">
        <CarouselContent className="-ml-1">
          {categories.map((cat, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/3 lg:basis-1/4"
            >
              <div className="p-1">
                <Card
                  onClick={() => setCategory(cat)}
                  className={`cursor-pointer text-center ${
                    category === cat
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  <CardContent className="p-4">
                    <span className="text-md font-semibold">
                      {cat.toUpperCase()}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* 로딩 표시 */}
      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
          뉴스 불러오는 중...
        </p>
      )}

      {/* 뉴스 카드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {articles.map((article, index) => (
          <div
            key={index}
            className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg"
          >
            <h2 className="text-lg font-semibold mt-2 text-gray-900 dark:text-gray-100">
              {article.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {article.source_name}
            </p>
            <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
              {summaries[index] ||
              (article.description && article.description.length > 150)
                ? article.description.slice(0, 150) + "..."
                : article.description || "설명이 없습니다."}
            </p>

            <div className="mt-2 flex space-x-2">
              <Button asChild>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  기사 보기
                </a>
              </Button>

              <Button onClick={() => handleSummarize(index, article.content)}>
                요약하기
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
