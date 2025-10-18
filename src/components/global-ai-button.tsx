
'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Wand2} from 'lucide-react';
import {
  suggestTheme,
  ThemeSuggestionInput,
  ThemeSuggestionOutput,
} from '@/ai/flows/suggest-theme';

export function GlobalAIButton() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<ThemeSuggestionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setResponse(null);
    setError(null);
    try {
      const input: ThemeSuggestionInput = {prompt};
      const result = await suggestTheme(input);
      setResponse(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <Wand2 className="h-6 w-6" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>AI UI Assistant</DrawerTitle>
            <DrawerDescription>
              Describe the UI changes you want to see.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <form onSubmit={handleSubmit}>
              <div className="grid items-start gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="prompt">Your Request</Label>
                  <Input
                    id="prompt"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="e.g., 'A forest green theme'"
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </form>
            {response && (
              <div className="mt-4">
                <Label>Suggested CSS</Label>
                <pre className="mt-2 w-full whitespace-pre-wrap rounded-md bg-muted p-4 text-xs">
                  <code>{response.theme}</code>
                </pre>
              </div>
            )}
            {error && (
              <div className="mt-4 text-red-500">
                <p>Error: {error}</p>
              </div>
            )}
          </div>
          <DrawerFooter>
            <DrawerTrigger asChild>
              <Button variant="outline">Close</Button>
            </DrawerTrigger>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
