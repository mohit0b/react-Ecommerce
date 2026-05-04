/**
 * Fake AI API — simulates multi-model responses with realistic delays.
 * Each model has a distinct personality and response style.
 */

const modelPersonalities = {
  'gpt-4': {
    name: 'GPT-4',
    prefix: '🧠',
    style: 'analytical and detailed',
    responses: [
      "That's a great question! Let me break this down systematically.",
      "Here's my analysis based on the information provided.",
      "I've considered multiple angles on this topic.",
      "Let me walk you through this step by step.",
      "Based on my understanding, here's a comprehensive answer."
    ]
  },
  'gemini': {
    name: 'Gemini',
    prefix: '✨',
    style: 'creative and multimodal',
    responses: [
      "Interesting! Here's what I think about this.",
      "Let me offer a creative perspective on this.",
      "I can see this from multiple dimensions.",
      "Here's an innovative approach to consider.",
      "Let me synthesize different viewpoints for you."
    ]
  },
  'claude': {
    name: 'Claude',
    prefix: '🎯',
    style: 'thoughtful and nuanced',
    responses: [
      "I appreciate you asking about this. Let me share my thoughts carefully.",
      "This is worth thinking through carefully.",
      "Here's my honest and balanced perspective.",
      "Let me approach this thoughtfully.",
      "I want to give you a well-considered answer."
    ]
  },
  'llama': {
    name: 'LLaMA 3',
    prefix: '🦙',
    style: 'open-source and straightforward',
    responses: [
      "Sure, here's what I know about this.",
      "Let me give you a straightforward answer.",
      "Here's the key information you need.",
      "I'll keep this clear and concise.",
      "Here's a direct answer for you."
    ]
  },
  'mistral': {
    name: 'Mistral',
    prefix: '🌊',
    style: 'efficient and precise',
    responses: [
      "Here's a precise answer for you.",
      "Let me distill this to the essentials.",
      "Efficiently put, here's what you need to know.",
      "I'll give you a focused response.",
      "Here's the core of the matter."
    ]
  }
};

const generateDetailedResponse = (input, model) => {
  const personality = modelPersonalities[model] || modelPersonalities['gpt-4'];
  const randomResponse = personality.responses[
    Math.floor(Math.random() * personality.responses.length)
  ];

  const inputLower = input.toLowerCase();

  // Contextual responses
  if (inputLower.includes('hello') || inputLower.includes('hi') || inputLower.includes('hey') || inputLower.includes('hello')) {
    return `${personality.prefix} ${inputLower}! I'm ${personality.name}. I'm here to help you with anything you need. My style is ${personality.style}. What would you like to explore today?`;
  }

  

  if (inputLower.includes('who are you') || inputLower.includes('what are you')) {
    return `${personality.prefix} I'm ${personality.name}, an AI language model. My approach is ${personality.style}. I can help with coding, analysis, creative writing, math, and much more!`;
  }

  if (inputLower.includes('code') || inputLower.includes('programming') || inputLower.includes('function')) {
    return `${personality.prefix} ${randomResponse}\n\nHere's a sample approach:\n\n\`\`\`javascript\nfunction solve(input) {\n  // Process the input\n  const result = input\n    .split(' ')\n    .map(word => word.trim())\n    .filter(Boolean);\n  \n  return result;\n}\n\`\`\`\n\nWould you like me to elaborate on any part of this?`;
  }

  if (inputLower.includes('explain') || inputLower.includes('what is') || inputLower.includes('how does')) {
    return `${personality.prefix} ${randomResponse}\n\n**Key Points:**\n\n1. **Foundation** — Understanding the basics is crucial\n2. **Application** — Here's how it works in practice\n3. **Advanced** — Taking it to the next level\n\nWould you like me to dive deeper into any of these areas?`;
  }

  if (inputLower.includes('help')) {
    return `${personality.prefix} Of course! I'm here to help. Here's what I can assist with:\n\n• 💻 **Coding** — Write, debug, and explain code\n• 📊 **Analysis** — Break down complex topics\n• ✍️ **Writing** — Draft content and documents\n• 🧮 **Math** — Solve calculations (try: "calculate 25 * 4")\n• 📅 **Tools** — Get the current date (try: "what's the date")\n\nWhat would you like to explore?`;
  }

  return `${personality.prefix} ${randomResponse}\n\nRegarding "${input}":\n\nThis is a thoughtful topic. Let me share my perspective as ${personality.name}:\n\n• The key consideration here is understanding the full context\n• There are multiple ways to approach this\n• I'd recommend starting with the fundamentals and building up\n\nWould you like me to go deeper on any specific aspect?`;
};

export const getAIResponse = async (prompt, rawInput, model, temperature = 0.7) => {
  return new Promise((resolve, reject) => {
    // Simulate varying response times per model
    const delays = {
      'gpt-4': 800 + Math.random() * 700,
      'gemini': 600 + Math.random() * 500,
      'claude': 900 + Math.random() * 800,
      'llama': 500 + Math.random() * 400,
      'mistral': 400 + Math.random() * 300
    };

    const delay = delays[model] || 1000;

    // Randomly simulate a failure for demonstration purposes (10% chance)
    if (Math.random() < 0.1 && model !== 'mistral') {
      setTimeout(() => reject(new Error('Model timeout or 503 error')), delay / 2);
      return;
    }

    setTimeout(() => {
      resolve({
        response: generateDetailedResponse(rawInput, model),
        aiLatency: delay,
        usedModel: model
      });
    }, delay);
  });
};

export const getWithFallback = async (prompt, rawInput, model, temperature = 0.7) => {
  const startTime = Date.now();
  try {
    return await getAIResponse(prompt, rawInput, model, temperature);
  } catch (error) {
    console.log(`[Gateway] Fallback triggered for model ${model}. Error: ${error.message}`);
    // Fallback to Mistral which we assume is our robust, highly-available backup
    const fallbackResult = await getAIResponse(prompt, rawInput, "mistral", temperature);
    return {
      ...fallbackResult,
      aiLatency: Date.now() - startTime // Total latency including failed attempt
    };
  }
};
