export async function summarizeNews(description: string) {
  try {
    const res = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }), // ✅ key를 'description'으로 변경
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        errorData?.error || `⚠️ 서버 오류: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    if (!data.summary) {
      throw new Error(
        "⚠️ OpenAI 서버에서 응답이 없습니다. 잠시 후 다시 시도하세요."
      );
    }

    return data.summary;
  } catch (error: unknown) {
    console.error("요약 요청 실패:", error);

    if (error instanceof Error) {
      return `⚠️ ${error.message}`;
    }

    return "⚠️ 알 수 없는 오류가 발생했습니다.";
  }
}
