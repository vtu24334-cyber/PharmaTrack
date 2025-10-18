'use server';
/**
 * @fileOverview A flow that suggests a new theme for the application.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

// Define the input schema for the theme suggestion flow.
const ThemeSuggestionInputSchema = z.object({
  prompt: z.string().describe('The user prompt for the new theme.'),
});
export type ThemeSuggestionInput = z.infer<typeof ThemeSuggestionInputSchema>;

// Define the output schema for the theme suggestion flow.
const ThemeSuggestionOutputSchema = z.object({
  theme: z.string().describe('The CSS code for the new theme.'),
});
export type ThemeSuggestionOutput = z.infer<typeof ThemeSuggestionOutputSchema>;

// Define the prompt for the theme suggestion flow.
const themeSuggestionPrompt = ai.definePrompt({
  name: 'themeSuggestionPrompt',
  input: {schema: ThemeSuggestionInputSchema},
  output: {schema: ThemeSuggestionOutputSchema},
  model: googleAI('gemini-1.5-flash-latest'),
  prompt: `
You are a creative UI designer who is an expert at creating beautiful and modern color schemes.
Your task is to generate a new color theme for a web application based on the user's prompt.

The application uses Tailwind CSS with CSS variables for theming. You need to generate the CSS code for the new theme.
The theme should include both a light and a dark mode.

Here is an example of the CSS structure you should follow:

@layer base {
  :root {
    --background: HSL_VALUE;
    --foreground: HSL_VALUE;
    --card: HSL_VALUE;
    --card-foreground: HSL_VALUE;
    --popover: HSL_VALUE;
    --popover-foreground: HSL_VALUE;
    --primary: HSL_VALUE;
    --primary-foreground: HSL_VALUE;
    --secondary: HSL_VALUE;
    --secondary-foreground: HSL_VALUE;
    --muted: HSL_VALUE;
    --muted-foreground: HSL_VALUE;
    --accent: HSL_VALUE;
    --accent-foreground: HSL_VALUE;
    --destructive: HSL_VALUE;
    --destructive-foreground: HSL_VALUE;
    --border: HSL_VALUE;
    --input: HSL_VALUE;
    --ring: HSL_VALUE;
  }

  .dark {
    --background: HSL_VALUE;
    --foreground: HSL_VALUE;
    --card: HSL_VALUE;
    --card-foreground: HSL_VALUE;
    --popover: HSL_VALUE;
    --popover-foreground: HSL_VALUE;
    --primary: HSL_VALUE;
    --primary-foreground: HSL_VALUE;
    --secondary: HSL_VALUE;
    --secondary-foreground: HSL_VALUE;
    --muted: HSL_VALUE;
    --muted-foreground: HSL_VALUE;
    --accent: HSL_VALUE;
    --accent-foreground: HSL_VALUE;
    --destructive: HSL_VALUE;
    --destructive-foreground: HSL_VALUE;
    --border: HSL_VALUE;
    --input: HSL_VALUE;
    --ring: HSL_VALUE;
  }
}

Do not include any other CSS variables. Only generate the CSS code for the theme.
Do not wrap the CSS code in a code block.

Here is the user's prompt:
{{{prompt}}}
  `,
});

// Define the flow for suggesting a new theme.
const suggestThemeFlow = ai.defineFlow(
  {
    name: 'suggestTheme',
    inputSchema: ThemeSuggestionInputSchema,
    outputSchema: ThemeSuggestionOutputSchema,
  },
  async input => {
    const {output} = await themeSuggestionPrompt(input);
    return output!;
  }
);

// Export a wrapper function to be used in the application.
export async function suggestTheme(
  input: ThemeSuggestionInput
): Promise<ThemeSuggestionOutput> {
  return suggestThemeFlow(input);
}
