"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchNews } from "@/utils/fetchNews";
import { summarizeNews } from "@/utils/summarizeNews";
import ThemeToggle from "@/components/themeToggle";
import ErrorMessage from "@/components/errorMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

type SummaryMap = {
  [key: string]: SummaryItem;
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

export default function HomeClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState("top");
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<SummaryMap>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loadingSummaries, setLoadingSummaries] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const news = await fetchNews(category);

      if (typeof news[0] === "string") {
        setErrorMessage(news[0]);
        setArticles([]);
      } else {
        setErrorMessage(null);
        setArticles(news);
      }
      setLoading(false);
    }
    loadNews();
    setSummaries({});
  }, [category]);

  const handleSummarize = useCallback(
    async (link: string, description: string) => {
      if (!description || description.trim() === "") {
        alert("요약할 설명이 없습니다.");
        return;
      }

      setLoadingSummaries((prev) => ({ ...prev, [link.toLowerCase()]: true }));

      try {
        const response = await summarizeNews(description);
        const summaryArray = response?.summary;

        if (Array.isArray(summaryArray) && summaryArray.length > 0) {
          setSummaries((prev) => ({
            ...prev,
            [link.toLowerCase()]: summaryArray[0],
          }));
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingSummaries((prev) => ({
          ...prev,
          [link.toLowerCase()]: false,
        }));
      }
    },
    []
  );

  return (
    <div className="min-h-screen bg-background px-5 pb-5 w-full max-w-[1920px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-mono mt-4 text-foreground">
          NewsMorn - AI요약
        </h1>
        <ThemeToggle />
      </div>

      <Carousel className="w-full mx-auto bg-[#F4F4F5] p-2 rounded-lg dark:bg-[#27272A]">
        <CarouselContent className="-ml-1">
          {categories.map((cat, index) => (
            <CarouselItem
              key={index}
              className="pl-1 basis-1/2 md:basis-1/5 lg:basis-1/7"
            >
              <Card
                onClick={() => {
                  if (cat !== category) setCategory(cat);
                }}
                className={`w-full h-full cursor-pointer text-center border-none overflow-hidden transition-all ${
                  category === cat
                    ? "bg-white text-zinc-900 font-mono font-bold dark:bg-[#09090B] dark:text-[#FAFAFA]"
                    : "bg-[#F4F4F5] text-zinc-400 dark:bg-[#27272A] dark:text-[#626268]"
                }`}
              >
                <CardContent className="w-full p-0">
                  <span className="text-sm font-mono">{cat.toUpperCase()}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {loading && (
        <p className="text-center text-muted-foreground mt-4">
          뉴스 불러오는 중...
        </p>
      )}

      {!loading && errorMessage && <ErrorMessage message={errorMessage} />}

      {!loading && !errorMessage && articles.length > 0 && (
        <div className="font-sans columns-1 lg:columns-2 xl:columns-3 gap-4 mt-4">
          {articles.map((article) => {
            const isLoadingSummary =
              loadingSummaries[article.link.toLowerCase()];
            const summary = summaries[article.link.toLowerCase()];
            return (
              <div
                key={article.link}
                className="mb-4 break-inside-avoid rounded-xl border bg-background text-card-foreground shadow"
              >
                <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                  <p className="text-base font-bold">{article.title}</p>
                </div>
                <div className="p-6 pt-0 pb-0">
                  <p className="text-xs text-muted-foreground">
                    {article.source_name}
                  </p>

                  {isLoadingSummary ? (
                    // Skeleton UI
                    <div className="mt-2 bg-primary/4 p-4 rounded-lg border shadow-inner">
                      <h3 className="font-sans text-primary mb-2">
                        <Skeleton
                          width="30%"
                          height={20}
                          borderRadius={8}
                          baseColor="var(--skeleton-base)"
                          highlightColor="var(--skeleton-highlight)"
                          duration={1.2}
                        />
                      </h3>
                      <div className="list-disc list-inside text-sm font-sans text-foreground space-y-1">
                        <Skeleton
                          width="70%"
                          height={20}
                          borderRadius={8}
                          baseColor="var(--skeleton-base)"
                          highlightColor="var(--skeleton-highlight)"
                          duration={1.2}
                        />
                        <Skeleton
                          width="90%"
                          height={20}
                          borderRadius={8}
                          baseColor="var(--skeleton-base)"
                          highlightColor="var(--skeleton-highlight)"
                          duration={1.2}
                        />
                        <Skeleton
                          width="60%"
                          height={20}
                          borderRadius={8}
                          baseColor="var(--skeleton-base)"
                          highlightColor="var(--skeleton-highlight)"
                          duration={1.2}
                        />
                      </div>
                    </div>
                  ) : summary ? (
                    // 실제 요약
                    <div className="mt-2 bg-primary/4 p-4 rounded-lg border shadow-inner">
                      <h3 className="font-sans text-primary mb-2">세줄요약</h3>
                      <ul className="list-disc list-inside text-sm font-sans text-foreground space-y-1">
                        <li>{summary["1"]}</li>
                        <li>{summary["2"]}</li>
                        <li>{summary["3"]}</li>
                      </ul>
                    </div>
                  ) : (
                    // 설명만
                    <p className="text-sm mt-2 text-foreground">
                      {article.description || "설명이 없습니다."}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-col md:flex-row justify-end gap-2 px-6 pb-4">
                  {article.description && (
                    <Button
                      className="cursor-pointer bg-background text-foreground border"
                      onClick={() =>
                        handleSummarize(article.link, article.description)
                      }
                    >
                      요약하기
                    </Button>
                  )}
                  <Button
                    className="bg-background text-foreground border"
                    asChild
                  >
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      기사 보기
                    </a>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
