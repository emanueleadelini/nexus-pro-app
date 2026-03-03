
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2, Copy, Check } from "lucide-react";
import { generatePostDraft, GeneratePostDraftOutput } from "@/ai/flows/generate-post-draft-flow";
import { useToast } from "@/hooks/use-toast";

export function PostGenerator({ clientName, clientIndustry }: { clientName: string, clientIndustry: string }) {
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratePostDraftOutput | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  async function handleGenerate() {
    if (!requirements) return;
    setLoading(true);
    try {
      const output = await generatePostDraft({
        clientName,
        clientIndustry,
        postRequirements: requirements,
      });
      setResult(output);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Non è stato possibile generare la bozza. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(`${result.title}\n\n${result.text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary font-headline">
          <Wand2 className="w-5 h-5 text-accent" />
          Assistente AI Copywriting
        </CardTitle>
        <CardDescription>
          Genera istantaneamente una bozza per {clientName} ({clientIndustry})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reqs">Di cosa deve parlare il post?</Label>
          <Textarea 
            id="reqs" 
            placeholder="es. Promozione estiva 20% di sconto, tono amichevole, focus su instagram..." 
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={loading || !requirements} 
          className="w-full bg-accent hover:bg-accent/90 text-primary-foreground"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
          Genera Bozza
        </Button>

        {result && (
          <div className="mt-6 p-4 rounded-lg bg-muted border border-border space-y-3 relative group">
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
            <div>
              <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Titolo Suggerito</h4>
              <p className="font-headline text-lg">{result.title}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Testo del Post</h4>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.text}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
