const CHATBOT_API_URL =
  process.env.NEXT_PUBLIC_CHATBOT_API_URL ||
  "http://localhost:8000/api/chatbot/";

export type ChatbotResponse = {
  answer: string;
  response_time: number;
};

export async function sendMessageToChatbot(
  message: string
): Promise<ChatbotResponse> {
  console.log("📤 [Chatbot] Sending message:", message);
  console.log("🌐 [Chatbot] API URL:", CHATBOT_API_URL);

  let res: Response;

  try {
    res = await fetch(CHATBOT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
  } catch (networkError) {
    console.error("❌ [Chatbot] Network error:", networkError);
    throw networkError;
  }

  console.log("📥 [Chatbot] HTTP status:", res.status);

  let data: any;
  try {
    data = await res.json();
  } catch (parseError) {
    console.error("❌ [Chatbot] JSON parse error:", parseError);
    throw parseError;
  }

  console.log("📥 [Chatbot] Raw response:", data);

  if (!res.ok) {
    console.error("❌[Chatbot] API returned error:", data);
    throw new Error(data?.message || "Chatbot API error");
  }

  //  check field tồn tại
  if (typeof data.answer !== "string") {
    console.error(" [Chatbot] Missing 'answer' field", data);
    throw new Error("Invalid chatbot response: missing answer");
  }

  return {
    answer: data.answer,
    response_time: data.response_time ?? 0,
  };
}
