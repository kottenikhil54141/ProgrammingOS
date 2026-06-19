type ChatRole = "system" | "user" | "assistant";

interface MentorTopicPayload {
  id: string;
  title: string;
  phase: string;
  duration: string;
  difficulty: string;
  objectives: string[];
  theory: string;
  templateCode: string;
  chaosExercise?: {
    title: string;
    description: string;
    brokenCode: string;
    correctCode: string;
  };
}

interface MentorRequestBody {
  language: "python" | "javascript";
  userMessage: string;
  topic: MentorTopicPayload;
  conversationHistory?: Array<{ role: ChatRole; content: string }>;
}

interface OpenAIChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

const endpoint =
  process.env.AI_MENTOR_ENDPOINT || "https://api.openai.com/v1/chat/completions";
const apiKey = process.env.AI_MENTOR_API_KEY || process.env.OPENAI_API_KEY || "";
const model = process.env.AI_MENTOR_MODEL || "gpt-4o-mini";

function buildSystemPrompt(language: string, topic: MentorTopicPayload) {
  return `You are the ProgrammingOS AI Mentor, an autonomous LLM tutor inside an interactive coding lesson.

Hard rules:
- Answer only for the current topic: ${topic.title}.
- If the user asks outside this topic, briefly redirect them back to ${topic.title}.
- Do not give generic theory only. Every answer must include practical code, debugging steps, or a runnable practice task.
- Prefer concise, professional teaching with clear sections.
- If helping with a bug, explain the cause, provide corrected code, and explain why it works.
- Use ${language} code fences.

Current lesson:
Title: ${topic.title}
Phase: ${topic.phase}
Difficulty: ${topic.difficulty}
Duration: ${topic.duration}
Objectives:
${topic.objectives.map((objective) => `- ${objective}`).join("\n")}

Starter code:
\`\`\`${language}
${topic.templateCode}
\`\`\`

Chaos exercise:
${topic.chaosExercise ? `${topic.chaosExercise.title}
${topic.chaosExercise.description}

Broken code:
\`\`\`${language}
${topic.chaosExercise.brokenCode}
\`\`\`

Correct code:
\`\`\`${language}
${topic.chaosExercise.correctCode}
\`\`\`` : "No chaos exercise available."}`;
}

export async function GET() {
  return Response.json({
    configured: Boolean(apiKey),
    provider: process.env.AI_MENTOR_ENDPOINT ? "custom" : "openai",
    model,
  });
}

export async function POST(request: Request) {
  if (!apiKey) {
    return Response.json(
      {
        success: false,
        error:
          "Server AI Mentor is not configured. Set OPENAI_API_KEY or AI_MENTOR_API_KEY.",
      },
      { status: 503 }
    );
  }

  const body = (await request.json()) as MentorRequestBody;
  const messages: Array<{ role: ChatRole; content: string }> = [
    {
      role: "system",
      content: buildSystemPrompt(body.language, body.topic),
    },
    ...(body.conversationHistory || []).slice(-8),
    {
      role: "user",
      content: body.userMessage,
    },
  ];

  const upstream = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.45,
      max_tokens: 1200,
      top_p: 0.9,
    }),
  });

  const data = (await upstream.json()) as OpenAIChatResponse;

  if (!upstream.ok) {
    return Response.json(
      {
        success: false,
        error: data.error?.message || upstream.statusText,
      },
      { status: upstream.status }
    );
  }

  return Response.json({
    success: true,
    message: data.choices?.[0]?.message?.content || "",
    model,
  });
}
