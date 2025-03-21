import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SummaryItem {
  1: string;
  2: string;
  3: string;
}

interface SummaryResponse {
  summary: SummaryItem[];
}

const generateDescriptionSummarize = async (
  description: string
): Promise<SummaryResponse> => {
  const prompt = `
너는 사용자가 원하는 뉴스를 세줄 요약하는 전문가야. 각 요약문장은 30자가 넘지 않게 핵심만,
출력 형식은 JSON이어야 하고, 영어 뉴스라면 한글로 번역해줘.

## 출력 형식 예시:
{
  "summary": [
    {
      "1": "1. 첫 번째 문장",
      "2": "2. 두 번째 문장",
      "3": "3. 세 번째 문장"
    }
  ]
}`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: description },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message?.content;

    if (!content) {
      console.error("⚠️ OpenAI 응답이 비어 있음.");
      throw new Error("OpenAI 응답이 없습니다.");
    }

    console.log("GPT 응답 원본:", content);

    const parsed = JSON.parse(content);
    return parsed as SummaryResponse;
  } catch (error) {
    console.error("OpenAI API 요청 실패:", error);
    throw new Error("요약을 생성할 수 없습니다.");
  }
};

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "뉴스 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    const summary = await generateDescriptionSummarize(description);

    return NextResponse.json({ summary });
  } catch (error: unknown) {
    console.error("OpenAI API 요청 실패:", error);

    let errorMessage = "요약을 생성할 수 없습니다.";
    let statusCode = 500;

    if (typeof error === "object" && error !== null && "response" in error) {
      const errorResponse = error as { response: { status: number } };
      statusCode = errorResponse.response.status;

      if (statusCode === 429) {
        errorMessage = "API 요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.";
      } else if (statusCode === 401) {
        errorMessage = "OpenAI API 키가 올바르지 않습니다.";
      } else if (statusCode === 403) {
        errorMessage =
          "토큰이 부족하여 요약을 생성할 수 없습니다. 결제를 확인하세요.";
      } else if (statusCode === 500) {
        errorMessage = "OpenAI 서버 오류로 인해 요약을 생성할 수 없습니다.";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
