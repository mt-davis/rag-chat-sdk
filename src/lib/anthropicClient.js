import Anthropic from '@anthropic-ai/sdk';

const isDemoMode = !process.env.ANTHROPIC_API_KEY;

const anthropic = isDemoMode ? {
  messages: {
    create: async () => ({
      content: [
        {
          text: 'This is a demo response. Please add your ANTHROPIC_API_KEY to .env.local to use the real API.'
        }
      ]
    })
  }
} : new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export { anthropic };