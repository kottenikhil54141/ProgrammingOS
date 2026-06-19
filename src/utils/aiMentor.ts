import { RealAIMentorService } from "@/services/realAIMentor";

export interface CurriculumTopicContext {
  id: string;
  title: string;
  phase: string;
  duration: string;
  difficulty: string;
  objectives: string[];
  theory: string;
  templateCode: string;
  chaosExercise: {
    id: string;
    title: string;
    description: string;
    brokenCode: string;
    correctCode: string;
    validationScript: string;
  };
  quizzes: unknown[];
}

/**
 * Fallback mock responses when AI API is not available
 */
function getMockAIMentorResponse(
  language: "python" | "javascript",
  userMessage: string,
  topic: CurriculumTopicContext
): string {
  const query = userMessage.toLowerCase();
  const firstExample = topic.templateCode || topic.chaosExercise.correctCode;

  if (
    query.includes("javascript") ||
    query.includes("java ") ||
    query.includes("react") ||
    query.includes("css") ||
    query.includes("html")
  ) {
    return `### Current Topic Only: ${topic.title}

I can help with the lesson you are currently studying: **${topic.title}**.

Try this ${language} practice snippet for the current topic:
\`\`\`${language}
${firstExample}
\`\`\`

Ask me to explain this code line-by-line, debug the Chaos exercise, or create another practice task for **${topic.title}**.`;
  }

  // 1. Requesting direct solution or how to rectify/solve the Chaos exercise
  if (
    query.includes("solve") ||
    query.includes("solution") ||
    query.includes("rectify") ||
    query.includes("fix") ||
    query.includes("correct code") ||
    query.includes("how to run")
  ) {
    return `### Solution Analysis: ${topic.chaosExercise.title}

Here is a step-by-step breakdown of how to solve and rectify this challenge:

#### Broken Code
\`\`\`${language}
${topic.chaosExercise.brokenCode}
\`\`\`

Problem: ${topic.chaosExercise.description}

#### Correct Code
\`\`\`${language}
${topic.chaosExercise.correctCode}
\`\`\`

#### Why This Works
The fixed version follows the current topic rules for **${topic.title}** and keeps the execution path valid before the validation script runs.`;
  }

  // 2. Requesting a Hint
  if (query.includes("hint") || query.includes("help") || query.includes("stuck")) {
    return `### Hint for "${topic.chaosExercise.title}"

Core challenge: ${topic.chaosExercise.description}

Look at this small version of the idea:
\`\`\`${language}
${topic.templateCode}
\`\`\`

Now compare it with the broken Chaos code and fix the line that violates the same rule.`;
  }

  // 3. Requesting explanation of the theory or how it works
  if (query.includes("explain") || query.includes("theory") || query.includes("what is") || query.includes("how does")) {
    return `### Topic Breakdown: ${topic.title}

Here is the current lesson converted into code-first guidance:

#### Goals
${topic.objectives.map((obj) => `- ${obj}`).join("\n")}

#### Runnable Demo
\`\`\`${language}
${topic.templateCode}
\`\`\`

#### Practice Task
Change one value in the demo, run it, and predict the output before checking the terminal. Then ask me why the output changed.`;
  }

  // 4. Default dynamic context-aware response
  return `### AI Mentor: ${topic.title}

I answer only for the topic currently open: **${topic.title}** (${topic.difficulty}).

Use this as your starting point:
\`\`\`${language}
${topic.templateCode}
\`\`\`

You can ask:
- "Explain this code line by line"
- "Solve the Chaos exercise"
- "Give me one more practice problem for ${topic.title}"`;
}

/**
 * Main AI Mentor function that tries real API first, then falls back to mock
 */
export async function getAIMentorResponse(
  language: "python" | "javascript",
  userMessage: string,
  topic: CurriculumTopicContext,
  useRealAI: boolean = true,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<string> {
  // If useRealAI is true and API is configured, try to use real AI
  if (useRealAI && RealAIMentorService.isConfigured()) {
    try {
      const response = await RealAIMentorService.sendMessage(
        userMessage,
        language,
        topic,
        conversationHistory
      );

      if (response.success && response.message) {
        return response.message;
      }
    } catch (error) {
      console.warn("Real AI mentor failed, falling back to mock:", error);
      // Fall through to mock response
    }
  }

  // Fall back to mock response
  return getMockAIMentorResponse(language, userMessage, topic);
}

/**
 * Initialize AI Mentor with API credentials
 */
export function initializeAIMentor(
  apiKey: string,
  provider: "openai" | "custom" = "openai",
  endpoint?: string,
  model?: string
) {
  RealAIMentorService.initialize(apiKey, provider, endpoint, model);
}

/**
 * Check if real AI is available
 */
export function isRealAIAvailable(): boolean {
  return RealAIMentorService.isConfigured();
}

/**
 * Get AI mentor status
 */
export function getAIMentorStatus() {
  return RealAIMentorService.getStatus();
}

/**
 * Helper functions for common AI mentor tasks
 */
export const AIMentorHelpers = {
  /**
   * Get debugging help for code
   */
  async getDebugHelp(code: string, language: "python" | "javascript", error?: string) {
    if (RealAIMentorService.isConfigured()) {
      const response = await RealAIMentorService.getDebugHelp(code, language, error);
      if (response.success) return response.message;
    }
    return `Please review this ${language} code and check for:
1. Syntax errors
2. Variable initialization
3. Scope issues
4. Type mismatches`;
  },

  /**
   * Get code explanation
   */
  async explainCode(code: string, language: "python" | "javascript") {
    if (RealAIMentorService.isConfigured()) {
      const response = await RealAIMentorService.explainCode(code, language);
      if (response.success) return response.message;
    }
    return `This ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nLet me help you understand what it does. Each line performs a specific task in the execution flow.`;
  },

  /**
   * Get exercise hint
   */
  async getExerciseHint(
    exerciseDescription: string,
    language: "python" | "javascript",
    brokenCode?: string
  ) {
    if (RealAIMentorService.isConfigured()) {
      const response = await RealAIMentorService.getExerciseHint(
        exerciseDescription,
        language,
        brokenCode
      );
      if (response.success) return response.message;
    }
    return `For "${exerciseDescription}", try looking at:
1. Variable declarations
2. Function parameters
3. Return statements
4. Loop conditions`;
  },

  /**
   * Explain a programming concept
   */
  async explainConcept(
    concept: string,
    language: "python" | "javascript",
    difficulty: "Beginner" | "Intermediate" | "Advanced" = "Beginner"
  ) {
    if (RealAIMentorService.isConfigured()) {
      const response = await RealAIMentorService.explainConcept(
        concept,
        language,
        difficulty
      );
      if (response.success) return response.message;
    }
    return `"${concept}" in ${language}:\n\n${concept} is a fundamental concept in programming that helps you...`;
  },
};
