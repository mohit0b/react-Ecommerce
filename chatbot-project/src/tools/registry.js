/**
 * Tool integrations for the AI chat platform.
 * Each tool has a name, description, icon, and execute function.
 */

export const tools = {
  calculator: {
    name: 'Calculator',
    description: 'Perform mathematical calculations',
    icon: '🧮',
    trigger: (input) => {
      const lower = input.toLowerCase();
      return lower.includes('calculate') || lower.includes('calc') ||
             lower.includes('math') || /^\d+[\s]*[+\-*/^%][\s]*\d+/.test(input.trim());
    },
    execute: (input) => {
      try {
        // Extract math expression from input
        let expression = input
          .replace(/calculate|calc|math|what is|what's|solve/gi, '')
          .trim();

        // Safety: only allow math characters
        if (!/^[\d\s+\-*/().%^]+$/.test(expression)) {
          return { success: false, result: 'Invalid expression. Use numbers and operators (+, -, *, /, ^, %).' };
        }

        // Replace ^ with ** for exponentiation
        expression = expression.replace(/\^/g, '**');

        // Use Function constructor instead of eval for slightly better safety
        const result = new Function(`return (${expression})`)();

        if (isNaN(result) || !isFinite(result)) {
          return { success: false, result: 'Invalid calculation result.' };
        }

        return {
          success: true,
          result: `🧮 **Calculator Result**\n\n\`${input.replace(/calculate|calc|math|what is|what's|solve/gi, '').trim()}\` = **${result}**`
        };
      } catch (e) {
        return { success: false, result: `Calculation error: ${e.message}` };
      }
    }
  },

  date: {
    name: 'Date & Time',
    description: 'Get current date and time',
    icon: '📅',
    trigger: (input) => {
      const lower = input.toLowerCase();
      return lower.includes('date') || lower.includes('time') ||
             lower.includes('today') || lower.includes('day is it');
    },
    execute: () => {
      const now = new Date();
      const options = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
      };
      return {
        success: true,
        result: `📅 **Date & Time**\n\n• **Date:** ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n• **Time:** ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}\n• **Timestamp:** ${now.toISOString()}`
      };
    }
  },

  weather: {
    name: 'Weather',
    description: 'Get simulated weather info',
    icon: '🌤️',
    trigger: (input) => {
      const lower = input.toLowerCase();
      return lower.includes('weather') || lower.includes('temperature outside') ||
             lower.includes('forecast');
    },
    execute: (input) => {
      const conditions = ['Sunny ☀️', 'Partly Cloudy ⛅', 'Cloudy ☁️', 'Rainy 🌧️', 'Thunderstorm ⛈️'];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const temp = Math.floor(Math.random() * 30) + 10;
      const humidity = Math.floor(Math.random() * 60) + 30;

      return {
        success: true,
        result: `🌤️ **Weather Report** *(simulated)*\n\n• **Condition:** ${condition}\n• **Temperature:** ${temp}°C / ${Math.round(temp * 9/5 + 32)}°F\n• **Humidity:** ${humidity}%\n• **Wind:** ${Math.floor(Math.random() * 20) + 5} km/h\n\n*Note: This is simulated data for demonstration.*`
      };
    }
  },

  joke: {
    name: 'Jokes',
    description: 'Tell a programming joke',
    icon: '😂',
    trigger: (input) => {
      const lower = input.toLowerCase();
      return lower.includes('joke') || lower.includes('funny') || lower.includes('laugh');
    },
    execute: () => {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        "There are 10 types of people in the world: those who understand binary, and those who don't.",
        "A SQL query walks into a bar, sees two tables, and asks: 'Can I JOIN you?' 🍺",
        "Why did the developer go broke? Because he used up all his cache! 💸",
        "!false — It's funny because it's true. 😄",
        "Why do Java developers wear glasses? Because they can't C#! 👓",
        "How many programmers does it take to change a light bulb? None — that's a hardware problem! 💡"
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];
      return {
        success: true,
        result: `😂 **Here's a joke for you:**\n\n${joke}`
      };
    }
  },

  uuid: {
    name: 'UUID Generator',
    description: 'Generate a unique identifier',
    icon: '🔑',
    trigger: (input) => {
      const lower = input.toLowerCase();
      return lower.includes('uuid') || lower.includes('generate id') ||
             lower.includes('unique id') || lower.includes('random id');
    },
    execute: () => {
      const ids = Array.from({ length: 3 }, () => crypto.randomUUID());
      return {
        success: true,
        result: `🔑 **Generated UUIDs:**\n\n\`\`\`\n${ids.join('\n')}\n\`\`\`\n\nFreshly generated and ready to use!`
      };
    }
  }
};

/**
 * Check if any tool should handle the input.
 * Returns the tool result or null if no tool matches.
 */
export const checkTools = (input) => {
  for (const [key, tool] of Object.entries(tools)) {
    if (tool.trigger(input)) {
      return {
        toolName: tool.name,
        toolIcon: tool.icon,
        ...tool.execute(input)
      };
    }
  }
  return null;
};
