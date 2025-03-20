import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content, length } = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Summarize the news provided by the user. Summarize length ${
            length === "short" ? "short" : "long"
          }.`,
        },
        {
          role: "user",
          content: content,
        },
      ],
      temperature: 0.7,
      max_tokens: length === "short" ? 50 : 100, // 50: 약 2줄, 150: ~4~5줄
    });
    console.log(completion.choices[0].message.content);

    return NextResponse.json({
      summary: completion.choices[0].message.content,
    });
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
