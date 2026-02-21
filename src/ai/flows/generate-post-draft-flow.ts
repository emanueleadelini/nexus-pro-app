'use server';
/**
 * @fileOverview A Genkit flow for generating social media post drafts.
 *
 * - generatePostDraft - A function that handles the generation of a social media post draft.
 * - GeneratePostDraftInput - The input type for the generatePostDraft function.
 * - GeneratePostDraftOutput - The return type for the generatePostDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// 1. Input Schema
const GeneratePostDraftInputSchema = z.object({
  clientName: z.string().describe('The name of the client company.'),
  clientIndustry: z.string().describe('The industry of the client company.'),
  postRequirements: z
    .string()
    .describe(
      'Detailed requirements for the social media post, including topic, tone, target audience, and any specific calls to action.'
    ),
});
export type GeneratePostDraftInput = z.infer<
  typeof GeneratePostDraftInputSchema
>;

// 2. Output Schema
const GeneratePostDraftOutputSchema = z.object({
  title:
    z.string().describe('A catchy and engaging title for the social media post.'),
  text:
    z.string().describe(
      'The main body text of the social media post, including relevant emojis and hashtags.'
    ),
});
export type GeneratePostDraftOutput = z.infer<
  typeof GeneratePostDraftOutputSchema
>;

// 3. Wrapper function
export async function generatePostDraft(
  input: GeneratePostDraftInput
): Promise<GeneratePostDraftOutput> {
  return generatePostDraftFlow(input);
}

// 4. Define the prompt
const generatePostDraftPrompt = ai.definePrompt({
  name: 'generatePostDraftPrompt',
  input: {schema: GeneratePostDraftInputSchema},
  output: {schema: GeneratePostDraftOutputSchema},
  prompt: `Sei un esperto copywriter di social media per un'agenzia di comunicazione. Il tuo compito è creare una bozza di post per i social media (titolo e testo) basata sui requisiti specifici di un cliente.

Informazioni sul cliente:
Nome azienda: {{{clientName}}}
Settore: {{{clientIndustry}}}

Requisiti del post:
{{{postRequirements}}}

Crea un titolo accattivante e il testo del post. Includi emoji e hashtag pertinenti per massimizzare l'engagement. Il tono deve essere coerente con i requisiti.
`,
});

// 5. Define the flow
const generatePostDraftFlow = ai.defineFlow(
  {
    name: 'generatePostDraftFlow',
    inputSchema: GeneratePostDraftInputSchema,
    outputSchema: GeneratePostDraftOutputSchema,
  },
  async input => {
    const {output} = await generatePostDraftPrompt(input);
    if (!output) {
      throw new Error('Failed to generate post draft: no output from prompt.');
    }
    return output;
  }
);
