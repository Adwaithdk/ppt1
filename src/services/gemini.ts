import { GoogleGenAI, Type } from "@google/genai";
import { Presentation, SlideStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error?.status === 429 || error?.message?.includes('429'))) {
      console.warn(`Rate limit hit. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function generatePresentation(topic: string, style: SlideStyle): Promise<Presentation> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Generate a comprehensive, professional, and COLORFUL presentation about: "${topic}". 
  The style should be ${style}.
  Provide a title, a subtitle, and at least 10-12 slides with deep, structured content.
  
  IMAGE GENERATION LOGIC (CRITICAL):
  1. CONTEXTUAL MATCHING: Parse the specific headings, bullet points, and explanations of EACH slide. Identify the most unique entity, action, or concept on THAT slide.
  2. GRANULAR RELEVANCE: Distinguish clearly between subtopics. If a slide is about "History", use vintage/historical imagery. If it's about "Healthcare", use medical/clinical imagery.
  3. QUALITY & PROFESSIONALISM: Always aim for "high-resolution professional stock photography". AVOID clipart, cartoons, or generic "business people shaking hands" unless specifically relevant.
  4. CONSISTENT AESTHETIC: Ensure the "visualDescription" for all slides suggests a consistent lighting, tone, and color palette (aligned with the themeColor).
  5. IMAGE QUERY FORMAT: Provide a "imageQuery" as a comma-separated list of 2-3 concrete keywords.
  
  EXAMPLES:
  - Slide: "Neural Network Architecture" -> Query: "synapse,circuitry,glowing"
  - Slide: "Patient Care in 2025" -> Query: "doctor,tablet,hospital,modern"
  - Slide: "The First Computers" -> Query: "mainframe,vintage,1950s"
  
  For each slide:
  1. A compelling title.
  2. A list of 3-5 key bullet points (content).
  3. A "deep explanation" paragraph (100-150 words).
  4. A "visualDescription" - A one-sentence description of a professional stock photo that reinforces the slide's specific message.
  5. An "imageQuery" - 2-3 specific keywords (comma-separated) derived from the visualDescription.
  6. A suggested layout: 'title', 'content', 'two-column', 'image-right', 'image-left', 'quote', 'comparison', 'timeline'.`;

  const response = await withRetry(() => ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          themeColor: { type: Type.STRING },
          slides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                content: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                explanation: { type: Type.STRING },
                visualDescription: { type: Type.STRING },
                imageQuery: { type: Type.STRING, description: "Comma-separated keywords, e.g., 'robot,circuitry'" },
                layout: { 
                  type: Type.STRING,
                  description: "One of: 'title', 'content', 'two-column', 'image-right', 'image-left', 'quote', 'comparison', 'timeline'"
                },
                notes: { type: Type.STRING }
              },
              required: ["title", "content", "explanation", "visualDescription", "imageQuery", "layout"]
            }
          }
        },
        required: ["title", "subtitle", "themeColor", "slides"]
      }
    }
  }));

  if (!response.text) {
    throw new Error("Failed to generate presentation content");
  }

  const presentation = JSON.parse(response.text) as Presentation;
  presentation.animationTheme = 'fade';
  
  // Use the comma-separated query directly for LoremFlickr, adding 'professional' for quality
  presentation.slides = presentation.slides.map(slide => ({
    ...slide,
    imageUrl: `https://loremflickr.com/800/600/${encodeURIComponent(slide.imageQuery.trim())},professional,stock/all`
  }));

  return presentation;
}
