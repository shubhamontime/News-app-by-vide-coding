import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform, Share } from 'react-native';

import type { NewsArticle } from '@/types/news';

export async function shareArticle(article: NewsArticle) {
  const body = `${article.title}\n\n${article.description}\n\n${article.url}`;

  if (Platform.OS !== 'web' && (await Sharing.isAvailableAsync())) {
    const file = new File(Paths.cache, `pulsewire-${article.id}.txt`);
    file.create({ intermediates: true, overwrite: true });
    file.write(body);
    await Sharing.shareAsync(file.uri, {
      dialogTitle: article.title,
      mimeType: 'text/plain',
      UTI: 'public.plain-text',
    });
    return;
  }

  await Share.share({
    title: article.title,
    message: body,
    url: article.url,
  });
}
