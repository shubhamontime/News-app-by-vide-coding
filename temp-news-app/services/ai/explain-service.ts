import { OPENAI_API_KEY, OPENAI_MODEL } from '@/constants/config';
import type { LanguageCode, NewsArticle } from '@/types/news';
import { localExplain, sanitizeArticleText } from '@/utils/text';

export async function explainArticle(article: NewsArticle, language: LanguageCode) {
  if (!OPENAI_API_KEY) {
    return localExplain(article, language);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input:
          language === 'hi'
            ? `निम्न समाचार लेख को 50 से 60 शब्दों में सरल हिंदी में समझाइए:\n\n${sanitizeArticleText(article)}`
            : `Explain the following news article in 50 to 60 words using clear, neutral English:\n\n${sanitizeArticleText(article)}`,
      }),
    });

    if (!response.ok) {
      return localExplain(article, language);
    }

    const data = (await response.json()) as { output_text?: string };
    return data.output_text?.trim() || localExplain(article, language);
  } catch (error) {
    return localExplain(article, language);
  }
}
