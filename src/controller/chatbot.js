const getGeminiRuntimeConfig = () => ({
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  baseUrl: process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta",
});

const buildSystemPrompt = () =>
  [
    "Bạn là trợ lý bán hàng cho cửa hàng văn phòng phẩm.",
    "Trả lời ngắn gọn, rõ ràng, ưu tiên gợi ý sản phẩm phù hợp nhu cầu.",
    "Nếu người dùng hỏi ngoài phạm vi mua sắm/đơn hàng, vẫn trả lời lịch sự và định hướng quay lại mục mua hàng.",
  ].join(" ");

export const askChatbot = async (req, res) => {
  try {
    const { model, baseUrl } = getGeminiRuntimeConfig();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        message: "Thiếu cấu hình GEMINI_API_KEY trên server",
      });
    }

    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({
        message: "Nội dung tin nhắn không được để trống",
      });
    }

    const endpoint = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemPrompt() }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 512,
        },
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: payload?.error?.message || "Không gọi được chatbot",
      });
    }

    const answer =
      payload?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text)
        .filter(Boolean)
        .join("\n") ||
      "Xin lỗi, hiện tại tôi chưa thể phản hồi. Bạn vui lòng thử lại sau.";

    return res.status(200).json({
      message: "success",
      data: {
        answer,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server khi gọi chatbot",
    });
  }
};
