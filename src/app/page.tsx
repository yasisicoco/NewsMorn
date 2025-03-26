import HomeClient from "@/components/homeClient";

export const metadata = {
  title: "NewsMorn - AI 뉴스요약",
  description: "현대인들을 위한 뉴스 3줄 요약 서비스",
  openGraph: {
    title: "NewsMorn - AI 뉴스 요약 서비스",
    description: "AI의 3줄 요약으로 최신 뉴스를 빠르고 쉽게 이해하세요😊",
    url: "https://news-morn.vercel.app",
    siteName: "NewsMorn",
    images: [
      {
        url: "https://news-morn.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "NewsMorn - AI 뉴스 요약 서비스",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NewsMorn - AI 뉴스 요약",
    description: "뉴스를 빠르고 쉽게 이해하세요.",
    images: ["https://news-morn.vercel.app/og-image.png"],
  },
  // robots: {
  //   index: true,
  //   follow: true,
  //   nocache: false,
  // },
};

export default function Page() {
  return <HomeClient />;
}
