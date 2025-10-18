/**
 * This file is the Genkit configuration file.
 * It is used to configure the Genkit AI framework.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin
export const ai = genkit({
  plugins: [
    googleAI({
      // In a production app, you should not hardcode the API key.
      // Use a secret manager to store the API key.
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  // Log all requests and responses to the console.
  // In a production app, you should use a proper logging solution.
  logLevel: 'info',
  // Use a simple file-based trace store for local development.
  // In a production app, you should use a proper trace store.
  traceStore: {
    provider: 'file',
    options: {
      path: './.genkit-traces.json',
    },
  },
});

export { genkit };
