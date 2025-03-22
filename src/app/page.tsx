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
} from "@/components/ui/carousel";

interface Article {
  title: string;
  link: string;
  description: string;
  source_name: string;
}

interface SummaryItem {
  1: string;
  2: string;
  3: string;
}

// 요약 결과 구조
type SummaryMap = {
  [index: number]: SummaryItem;
};

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
  const [summaries, setSummaries] = useState<SummaryMap>({});
  const { theme, setTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
  }, [category]);

  const handleSummarize = async (index: number, description: string) => {
    if (!description || description.trim() === "") {
      alert("요약할 설명이 없습니다.");
      return;
    }

    const response = await summarizeNews(description); // 🔄 수정
    const summaryArray = response?.summary;

    if (Array.isArray(summaryArray) && summaryArray.length > 0) {
      setSummaries((prev) => ({ ...prev, [index]: summaryArray[0] }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-5 w-full max-w-[1920px] mx-auto dark:bg-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold mt-4 text-gray-900 dark:text-gray-100">
          NewsMorn - AI 뉴스 요약
        </h1>
        {isClient && (
          <Button
            className="mt-4"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☀️ 라이트 모드" : "🌙 다크 모드"}
          </Button>
        )}
      </div>

      <Carousel className="w-full mx-auto">
        <CarouselContent className="-ml-1">
          {categories.map((cat, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/4 lg:basis-1/5"
            >
              <Card
                onClick={() => setCategory(cat)}
                className={`cursor-pointer text-center ${
                  category === cat
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                <CardContent>
                  <span className="text-sm font-semibold">
                    {cat.toUpperCase()}
                  </span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-300 mt-4">
          뉴스 불러오는 중...
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {articles.map((article, index) => {
          const summary = summaries[index];

          return (
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
                {article.description || "설명이 없습니다."}
              </p>

              {summary && (
                <div className="mt-4 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg shadow-inner">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                    요약
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-100 space-y-1">
                    <li>{summary["1"]}</li>
                    <li>{summary["2"]}</li>
                    <li>{summary["3"]}</li>
                  </ul>
                </div>
              )}

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

                {article.description && (
                  <Button
                    onClick={() => handleSummarize(index, article.description)}
                  >
                    요약하기
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
