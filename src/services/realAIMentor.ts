/**
 * Real AI Mentor Service - Integrates with LLM APIs (OpenAI, Claude, etc.)
 * Provides intelligent responses for both Python and JavaScript programming help
 */

export interface AIResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface AIMentorTopicContext {
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

const DEFAULT_SYSTEM_PROMPT = `You are an expert programming mentor specializing in teaching Python and JavaScript. Your role is to:
1. Provide clear, concise explanations of programming concepts
2. Help debug code and identify errors
3. Explain how code works step-by-step
4. Answer questions about syntax, memory, and best practices
5. Provide hints for learning exercises without giving away complete solutions
6. Adapt explanations to the learner's level (Beginner, Intermediate, Advanced)
7. Be encouraging and supportive

When explaining code:
- Use concrete examples
- Explain the "why" not just the "what"
- Break down complex concepts into smaller parts
- Reference the specific language features being discussed

Format your responses in markdown with clear sections when appropriate.`;

export class RealAIMentorService {
  private static apiKey: string | null = null;
  private static apiProvider: "openai" | "custom" = "openai";
  private static apiEndpoint: string = "https://api.openai.com/v1/chat/completions";
  private static model: string = "gpt-3.5-turbo";

  /**
   * Initialize the AI Mentor service with API credentials
   */
  static initialize(apiKey: string, provider: "openai" | "custom" = "openai", endpoint?: string, model?: string) {
    RealAIMentorService.apiKey = apiKey;
    RealAIMentorService.apiProvider = provider;
    if (endpoint) RealAIMentorService.apiEndpoint = endpoint;
    if (model) RealAIMentorService.model = model;
  }

  /**
   * Check if API is properly configured
   */
  static isConfigured(): boolean {
    return !!RealAIMentorService.apiKey;
  }

  /**
   * Get the current configuration status
   */
  static getStatus(): { configured: boolean; provider: string; model: string } {
    return {
      configured: RealAIMentorService.isConfigured(),
      provider: RealAIMentorService.apiProvider,
      model: RealAIMentorService.model,
    };
  }

  /**
   * Send a message to the AI mentor and get a response
   */
  static async sendMessage(
    userMessage: string,
    language: "python" | "javascript",
    topicContext?: string | AIMentorTopicContext,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<AIResponse> {
    const serverResponse = await RealAIMentorService.callAutonomousMentor(
      userMessage,
      language,
      topicContext,
      conversationHistory
    );

    if (serverResponse.success) {
      return serverResponse;
    }

    if (!RealAIMentorService.apiKey) {
      return {
        success: false,
        message: "",
        error:
          serverResponse.error ||
          "AI Mentor API not configured. Please set your API key.",
      };
    }

    try {
      const messages: Array<{ role: "user" | "system" | "assistant"; content: string }> = [
        {
          role: "system",
          content: `${DEFAULT_SYSTEM_PROMPT}\n\nYou are helping a student learn ${language.toUpperCase()} programming. ${
            topicContext
              ? `Current topic: ${
                  typeof topicContext === "string" ? topicContext : topicContext.title
                }. Stay focused on this current topic and include real runnable code in every answer.`
              : ""
          }`,
        },
      ];

      // Add conversation history if provided
      if (conversationHistory && conversationHistory.length > 0) {
        conversationHistory.forEach((msg) => {
          messages.push({
            role: msg.role as "user" | "system" | "assistant",
            content: msg.content,
          });
        });
      }

      messages.push({
        role: "user",
        content: userMessage,
      });

      if (RealAIMentorService.apiProvider === "openai") {
        return await RealAIMentorService.callOpenAI(messages);
      } else {
        return await RealAIMentorService.callCustomAPI(messages);
      }
    } catch (error) {
      console.error("Error calling AI Mentor:", error);
      return {
        success: false,
        message: "",
        error: `Failed to get AI response: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  private static async callAutonomousMentor(
    userMessage: string,
    language: "python" | "javascript",
    topicContext?: string | AIMentorTopicContext,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<AIResponse> {
    if (!topicContext || typeof topicContext === "string") {
      return {
        success: false,
        message: "",
        error: "No structured topic context was provided.",
      };
    }

    try {
      const response = await fetch("/api/ai/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          userMessage,
          topic: topicContext,
          conversationHistory,
        }),
      });

      const data = (await response.json()) as AIResponse;

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: "",
          error: data.error || "Autonomous AI Mentor is not available.",
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: "",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Call OpenAI API
   */
  private static async callOpenAI(
    messages: Array<{ role: "user" | "system" | "assistant"; content: string }>
  ): Promise<AIResponse> {
    const response = await fetch(RealAIMentorService.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RealAIMentorService.apiKey}`,
      },
      body: JSON.stringify({
        model: RealAIMentorService.model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenAI API error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return {
      success: true,
      message: content,
    };
  }

  /**
   * Call custom/local API endpoint
   */
  private static async callCustomAPI(
    messages: Array<{ role: "user" | "system" | "assistant"; content: string }>
  ): Promise<AIResponse> {
    const response = await fetch(RealAIMentorService.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RealAIMentorService.apiKey}`,
      },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.message || data.content || data.response || "";

    return {
      success: true,
      message: content,
    };
  }

  /**
   * Get help for debugging code
   */
  static async getDebugHelp(
    code: string,
    language: "python" | "javascript",
    error?: string
  ): Promise<AIResponse> {
    const prompt = `Please help me debug this ${language} code:

\`\`\`${language}
${code}
\`\`\`

${error ? `Error message: ${error}` : "The code is not working as expected."}

Please identify the issue and suggest a fix.`;

    return RealAIMentorService.sendMessage(prompt, language, "Code Debugging");
  }

  /**
   * Get explanation for a code snippet
   */
  static async explainCode(
    code: string,
    language: "python" | "javascript"
  ): Promise<AIResponse> {
    const prompt = `Please explain this ${language} code line by line:

\`\`\`${language}
${code}
\`\`\`

Focus on what each part does and why it's written this way.`;

    return RealAIMentorService.sendMessage(prompt, language, "Code Explanation");
  }

  /**
   * Get a hint for solving an exercise (without giving away the solution)
   */
  static async getExerciseHint(
    exerciseDescription: string,
    language: "python" | "javascript",
    brokenCode?: string
  ): Promise<AIResponse> {
    const prompt = `I'm working on a ${language} exercise: ${exerciseDescription}

${brokenCode ? `Current code:\n\`\`\`${language}\n${brokenCode}\n\`\`\`` : ""}

Can you give me a helpful hint about what to fix or how to approach this? Please don't give me the complete solution - just guide me in the right direction.`;

    return RealAIMentorService.sendMessage(prompt, language, "Exercise Help");
  }

  /**
   * Get a concept explanation
   */
  static async explainConcept(
    concept: string,
    language: "python" | "javascript",
    difficulty: "Beginner" | "Intermediate" | "Advanced" = "Beginner"
  ): Promise<AIResponse> {
    const prompt = `Explain the concept of "${concept}" in ${language} programming at a ${difficulty} level.

Include:
1. What it is
2. Why it matters
3. A simple example
4. Common mistakes to avoid`;

    return RealAIMentorService.sendMessage(prompt, language, `Learning: ${concept}`);
  }
}
