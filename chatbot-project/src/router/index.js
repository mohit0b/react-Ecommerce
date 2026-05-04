import { checkTools } from '../tools/registry';
import { getWithFallback } from '../api/gateway';

/**
 * AI Gateway Router
 * Decides whether to route the user's input to a Tool or to an AI model.
 */
export const routeRequest = async (input, model, temperature, systemPrompt) => {
  const startTime = Date.now();
  
  // 1. Check if input triggers any tool
  const toolResult = checkTools(input);

  if (toolResult) {
    const latency = Date.now() - startTime;
    return {
      type: "tool",
      toolName: toolResult.toolName,
      result: toolResult.success ? toolResult.result : `Tool Error (${toolResult.toolName}): ${toolResult.result}`,
      latency,
      time: Date.now()
    };
  }

  // 2. Build structured prompt (Prompt Engineering)
  const prompt = `
  System Prompt: ${systemPrompt || 'You are a helpful AI assistant.'}
  Model Engine: ${model}
  User Input: ${input}
  `;

  // 3. Call AI with fallback mechanism
  const { response, usedModel, aiLatency } = await getWithFallback(prompt, input, model, temperature);

  return {
    type: "ai",
    model: usedModel,
    result: response,
    latency: aiLatency,
    time: Date.now()
  };
};
