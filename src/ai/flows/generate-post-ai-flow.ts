
'use server';

/**
 * @fileOverview Flow per la generazione di post social con Gemini per AD next lab.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePostInputSchema = z.object({
  nomeAzienda: z.string(),
  settore: z.string(),
  brandTraining: z.object({
    brandVoice: z.string().optional(),
    targetAudience: z.string().optional(),
    keyValues: z.string().optional(),
    mainTopics: z.string().optional(),
  }).optional(),
  piattaforma: z.object({
    label: z.string(),
    istruzioni: z.string(),
  }),
  tono: z.object({
    label: z.string(),
    descrizione: z.string(),
  }),
  argomento: z.string(),
  noteAggiuntive: z.string().optional(),
});

const GeneratePostOutputSchema = z.object({
  titolo: z.string(),
  testo: z.string(),
});

export type GeneratePostInput = z.infer<typeof GeneratePostInputSchema>;
export type GeneratePostOutput = z.infer<typeof GeneratePostOutputSchema>;

const generatePostPrompt = ai.definePrompt({
  name: 'generatePostPrompt',
  input: { schema: GeneratePostInputSchema },
  output: { schema: GeneratePostOutputSchema },
  prompt: `Sei un social media manager esperto per AD next lab, un'agenzia di comunicazione italiana d'avanguardia.
Devi generare un post per i social media per uno dei nostri clienti.

INFORMAZIONI AZIENDA:
CLIENTE: {{{nomeAzienda}}}
SETTORE: {{{settore}}}

{{#if brandTraining}}
CONTESTO BRAND (DNA):
- VOCE DEL BRAND: {{{brandTraining.brandVoice}}}
- PUBBLICO TARGET: {{{brandTraining.targetAudience}}}
- VALORI CHIAVE: {{{brandTraining.keyValues}}}
- PILASTRI DI CONTENUTO: {{{brandTraining.mainTopics}}}
{{/if}}

DETTAGLI POST:
PIATTAFORMA: {{{piattaforma.label}}} ({{{piattaforma.istruzioni}}})
TONO RICHIESTO: {{{tono.label}}} ({{{tono.descrizione}}})
ARGOMENTO: {{{argomento}}}
NOTE AGGIUNTIVE: {{{noteAggiuntive}}}

ISTRUZIONI:
1. Scrivi in italiano in modo professionale e coinvolgente.
2. Adatta il linguaggio alla piattaforma indicata e al DNA del brand se fornito.
3. Usa il tono di voce richiesto.
4. NON inventare informazioni specifiche (prezzi, date, indirizzi) a meno che non siano nelle note.
5. Includi emoji se appropriato per la piattaforma.
6. Includi hashtag pertinenti.

FORMATO RISPOSTA (JSON):
TITOLO: [Titolo breve interno]
TESTO: [Corpo del post completo]`,
});

export async function generateSocialPost(input: GeneratePostInput): Promise<GeneratePostOutput> {
  const { output } = await generatePostPrompt(input);
  if (!output) throw new Error("Generazione fallita");
  return output;
}

// Flow per il Calendario Editoriale
const GenerateCalendarInputSchema = z.object({
  nomeAzienda: z.string(),
  settore: z.string(),
  brandTraining: z.object({
    brandVoice: z.string().optional(),
    targetAudience: z.string().optional(),
    keyValues: z.string().optional(),
    mainTopics: z.string().optional(),
  }).optional(),
  mese: z.string(),
  numeroPost: z.number().default(8),
});

const CalendarPostSchema = z.object({
  giorno: z.number(),
  titolo: z.string(),
  testo: z.string(),
  piattaforma: z.string(),
});

const GenerateCalendarOutputSchema = z.object({
  posts: z.array(CalendarPostSchema),
});

export type GenerateCalendarOutput = z.infer<typeof GenerateCalendarOutputSchema>;

const generateCalendarPrompt = ai.definePrompt({
  name: 'generateCalendarPrompt',
  input: { schema: GenerateCalendarInputSchema },
  output: { schema: GenerateCalendarOutputSchema },
  prompt: `Sei il Direttore Creativo di AD next lab.
Devi progettare un CALENDARIO EDITORIALE STRATEGICO per il mese di {{{mese}}} per il cliente {{{nomeAzienda}}}.

CLIENTE: {{{nomeAzienda}}}
SETTORE: {{{settore}}}

{{#if brandTraining}}
BRAND DNA:
- VOCE: {{{brandTraining.brandVoice}}}
- TARGET: {{{brandTraining.targetAudience}}}
- VALORI: {{{brandTraining.keyValues}}}
- TOPICS: {{{brandTraining.mainTopics}}}
{{/if}}

OBIETTIVO: Creare {{{numeroPost}}} post distribuiti nel mese che coprano diversi angoli comunicativi (informativo, emozionale, vendita, engagement).

ISTRUZIONI:
1. Scegli {{{numeroPost}}} giorni diversi nel mese.
2. Per ogni post scrivi un titolo interno e il copy completo in italiano.
3. Specifica la piattaforma social consigliata.
4. Assicurati che il piano sia coerente con il DNA del brand.

FORMATO RISPOSTA: Un array di oggetti post con giorno (numero), titolo, testo e piattaforma.`,
});

export async function generateMonthlyCalendar(input: any): Promise<GenerateCalendarOutput> {
  const { output } = await generateCalendarPrompt(input);
  if (!output) throw new Error("Generazione calendario fallita");
  return output;
}
