import { DEFAULT_IMAGE } from '@/constants/config';
import type { FeedRequest, FeedResponse, NewsArticle } from '@/types/news';
import { dedupeArticles, hashString } from '@/utils/text';

type MockTemplate = {
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  content: { en: string; hi: string };
  sourceName: string;
  imageUrl?: string;
  categories: NewsArticle['category'][];
  region: 'india' | 'world';
};

const templates: MockTemplate[] = [
  {
    title: {
      en: 'India expands solar freight corridors to cut logistics emissions',
      hi: 'भारत लॉजिस्टिक्स उत्सर्जन घटाने के लिए सोलर फ्रेट कॉरिडोर बढ़ा रहा है',
    },
    description: {
      en: 'Rail and logistics operators are piloting cleaner freight hubs across western India.',
      hi: 'रेल और लॉजिस्टिक्स ऑपरेटर पश्चिम भारत में क्लीन फ्रेट हब का परीक्षण कर रहे हैं।',
    },
    content: {
      en: 'Officials say the corridor combines rooftop solar, battery backups, and smart scheduling so high-volume freight routes can reduce diesel dependence while keeping delivery times stable.',
      hi: 'अधिकारियों के अनुसार यह कॉरिडोर रूफटॉप सोलर, बैटरी बैकअप और स्मार्ट शेड्यूलिंग को जोड़ता है, जिससे व्यस्त माल ढुलाई मार्ग डीज़ल पर निर्भरता घटा सकते हैं।',
    },
    sourceName: 'Metro Ledger',
    imageUrl:
      'https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=1200&q=80',
    categories: ['home', 'india', 'local', 'business', 'science'],
    region: 'india',
  },
  {
    title: {
      en: 'Global chip makers race to secure next wave of AI power demand',
      hi: 'एआई ऊर्जा मांग की अगली लहर के लिए वैश्विक चिप निर्माता तेज़ी से तैयारी कर रहे हैं',
    },
    description: {
      en: 'Manufacturers are balancing efficiency gains with tougher supply constraints.',
      hi: 'निर्माता दक्षता सुधार और कड़े सप्लाई दबाव के बीच संतुलन बना रहे हैं।',
    },
    content: {
      en: 'Analysts expect the strongest demand to come from enterprise inference clusters, where power-efficient chips and better cooling systems can directly lower costs for long-running AI workloads.',
      hi: 'विश्लेषकों का कहना है कि सबसे मजबूत मांग एंटरप्राइज इन्फरेंस क्लस्टर से आएगी, जहाँ ऊर्जा-कुशल चिप और बेहतर कूलिंग सिस्टम लंबे एआई वर्कलोड की लागत घटा सकते हैं।',
    },
    sourceName: 'Signal World',
    imageUrl:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    categories: ['home', 'world', 'technology', 'business', 'for-you'],
    region: 'world',
  },
  {
    title: {
      en: 'State health networks roll out faster telemedicine triage in tier-two cities',
      hi: 'टियर-2 शहरों में हेल्थ नेटवर्क तेज़ टेलीमेडिसिन ट्रायज शुरू कर रहे हैं',
    },
    description: {
      en: 'Hospitals say remote screening is cutting wait times during peak outpatient hours.',
      hi: 'अस्पतालों का कहना है कि रिमोट स्क्रीनिंग से व्यस्त समय में प्रतीक्षा अवधि घट रही है।',
    },
    content: {
      en: 'Clinicians are using digital triage desks to route patients faster toward specialists, follow-up labs, or prescription renewals, which is improving capacity without adding full new facilities.',
      hi: 'डिजिटल ट्रायज डेस्क मरीजों को विशेषज्ञ, लैब और प्रिस्क्रिप्शन रिन्यूअल तक जल्दी पहुँचा रहे हैं, जिससे बिना नई सुविधाएँ जोड़े क्षमता बढ़ रही है।',
    },
    sourceName: 'Civic Health Desk',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    categories: ['home', 'india', 'local', 'health'],
    region: 'india',
  },
  {
    title: {
      en: 'Streaming studios bet on regional releases and shorter production cycles',
      hi: 'स्ट्रीमिंग स्टूडियो क्षेत्रीय रिलीज़ और छोटे प्रोडक्शन साइकल पर दांव लगा रहे हैं',
    },
    description: {
      en: 'Fresh funding is flowing to language-first entertainment formats.',
      hi: 'भाषा-केंद्रित मनोरंजन प्रारूपों में नई फंडिंग आ रही है।',
    },
    content: {
      en: 'Media strategists say regional originals with faster turnarounds are attracting advertisers who want consistent audience retention rather than a few blockbuster windows each year.',
      hi: 'मीडिया रणनीतिकारों का कहना है कि तेज़ी से बनने वाले क्षेत्रीय ओरिजिनल, साल भर स्थिर दर्शक जुड़ाव चाहने वाले विज्ञापनदाताओं को आकर्षित कर रहे हैं।',
    },
    sourceName: 'Screen Brief',
    imageUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    categories: ['home', 'entertainment', 'india'],
    region: 'india',
  },
  {
    title: {
      en: 'Women-led startups close strong quarter across climate and fintech sectors',
      hi: 'क्लाइमेट और फिनटेक सेक्टर में महिला-नेतृत्व वाले स्टार्टअप्स का मजबूत तिमाही प्रदर्शन',
    },
    description: {
      en: 'Investors are rewarding resilient revenue models over vanity growth.',
      hi: 'निवेशक दिखावटी वृद्धि की जगह टिकाऊ राजस्व मॉडल को प्राथमिकता दे रहे हैं।',
    },
    content: {
      en: 'New seed and growth rounds show founders are winning support by proving repeat customers, lower churn, and clearer enterprise expansion paths even in cautious markets.',
      hi: 'नए निवेश दौर दिखाते हैं कि संस्थापक दोबारा आने वाले ग्राहकों, कम churn और स्पष्ट विस्तार रणनीति के कारण समर्थन पा रहे हैं।',
    },
    sourceName: 'Capital Current',
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    categories: ['business', 'for-you', 'india', 'home'],
    region: 'india',
  },
  {
    title: {
      en: 'National team analysts embrace real-time motion data before major tournaments',
      hi: 'बड़े टूर्नामेंट से पहले राष्ट्रीय टीम विश्लेषक रियल-टाइम मोशन डेटा अपना रहे हैं',
    },
    description: {
      en: 'Coaches are using wearable insights to shape rotation and recovery plans.',
      hi: 'कोच rotation और recovery की योजना के लिए wearable insights का उपयोग कर रहे हैं।',
    },
    content: {
      en: 'Performance staff say live sprint, load, and fatigue data help avoid overtraining while keeping key players fresher for tighter competition schedules.',
      hi: 'परफॉर्मेंस स्टाफ के अनुसार sprint, load और fatigue data से अधिक प्रशिक्षण से बचते हुए खिलाड़ियों को ताज़ा रखा जा सकता है।',
    },
    sourceName: 'GameLine',
    imageUrl:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    categories: ['sports', 'home', 'india'],
    region: 'india',
  },
  {
    title: {
      en: 'Ocean researchers map new warming patterns affecting fisheries',
      hi: 'महासागर शोधकर्ताओं ने मत्स्य पालन को प्रभावित करने वाले नए warming patterns मैप किए',
    },
    description: {
      en: 'The findings could help coastal planners react earlier to changing sea conditions.',
      hi: 'ये निष्कर्ष तटीय योजनाकारों को बदलती समुद्री स्थितियों पर जल्दी प्रतिक्रिया देने में मदद कर सकते हैं।',
    },
    content: {
      en: 'Scientists say shifting heat bands are changing breeding timing for several commercial species, making better early-warning models critical for fishing communities.',
      hi: 'वैज्ञानिकों के अनुसार बदलती गर्मी की पट्टियाँ कई व्यावसायिक प्रजातियों के breeding timing को बदल रही हैं, जिससे शुरुआती चेतावनी मॉडल महत्वपूर्ण हो गए हैं।',
    },
    sourceName: 'Blue Planet Post',
    imageUrl:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    categories: ['science', 'world', 'home'],
    region: 'world',
  },
  {
    title: {
      en: 'City transit pilots quieter electric bus lanes for rush-hour routes',
      hi: 'शहर ट्रांजिट भीड़भाड़ वाले मार्गों के लिए शांत इलेक्ट्रिक बस लेन का परीक्षण कर रहा है',
    },
    description: {
      en: 'Commuters are seeing steadier arrival times on dense urban corridors.',
      hi: 'घने शहरी कॉरिडोर में यात्रियों को अधिक स्थिर arrival time मिल रहा है।',
    },
    content: {
      en: 'Transport planners say reserved charging windows and signal priority are reducing bunching issues that usually affect electric bus deployment at scale.',
      hi: 'ट्रांसपोर्ट प्लानर कहते हैं कि reserved charging windows और signal priority से electric bus संचालन में होने वाली भीड़ समस्या घट रही है।',
    },
    sourceName: 'Urban Dispatch',
    imageUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    categories: ['local', 'india', 'home', 'science'],
    region: 'india',
  },
  {
    title: {
      en: 'World health agencies align on faster vaccine data exchange',
      hi: 'वैश्विक स्वास्थ्य एजेंसियाँ तेज़ vaccine data exchange पर सहमत हुईं',
    },
    description: {
      en: 'Public labs want cleaner reporting pipelines during cross-border outbreaks.',
      hi: 'सीमा-पार outbreaks के दौरान सार्वजनिक लैब बेहतर reporting pipeline चाहती हैं।',
    },
    content: {
      en: 'Officials argue standardised data exchange can shorten decision cycles when variant monitoring, distribution planning, and public guidance need to move together.',
      hi: 'अधिकारियों का कहना है कि standardised data exchange से variant monitoring, distribution planning और public guidance एक साथ तेज़ी से आगे बढ़ सकते हैं।',
    },
    sourceName: 'Global Health Wire',
    imageUrl:
      'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80',
    categories: ['health', 'world', 'home'],
    region: 'world',
  },
  {
    title: {
      en: 'Consumer tech brands focus on battery repairability in next launches',
      hi: 'अगले लॉन्च में consumer tech brands battery repairability पर ध्यान दे रहे हैं',
    },
    description: {
      en: 'Repair-friendly hardware is becoming a meaningful differentiator.',
      hi: 'repair-friendly hardware अब एक अहम अंतर बनता जा रहा है।',
    },
    content: {
      en: 'Product teams say customers are responding well to easier battery swaps, modular accessories, and clearer long-term software update commitments.',
      hi: 'प्रोडक्ट टीमों के अनुसार ग्राहक आसान battery swap, modular accessories और लंबे software support पर अच्छा प्रतिक्रिया दे रहे हैं।',
    },
    sourceName: 'Device Daily',
    imageUrl:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    categories: ['technology', 'business', 'home', 'world'],
    region: 'world',
  },
  {
    title: {
      en: 'Film festivals turn to immersive stagecraft to revive live attendance',
      hi: 'फिल्म फेस्टिवल live attendance बढ़ाने के लिए immersive stagecraft अपना रहे हैं',
    },
    description: {
      en: 'Curators are blending screenings with creator-led experiences.',
      hi: 'curator screening को creator-led अनुभवों के साथ जोड़ रहे हैं।',
    },
    content: {
      en: 'Event teams say hybrid audience formats work best when creators offer behind-the-scenes sessions, soundtrack performances, and short interactive premieres.',
      hi: 'इवेंट टीमों के अनुसार hybrid audience format तब बेहतर काम करते हैं जब creators behind-the-scenes sessions और interactive premieres शामिल करते हैं।',
    },
    sourceName: 'Culture Beat',
    imageUrl:
      'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80',
    categories: ['entertainment', 'world', 'showcase', 'home'],
    region: 'world',
  },
];

function buildMockArticle(
  template: MockTemplate,
  language: FeedRequest['language'],
  date: string,
  index: number
): NewsArticle {
  const hour = `${String((index * 2 + 8) % 24).padStart(2, '0')}:15:00.000Z`;
  return {
    id: hashString(`${template.sourceName}-${template.title.en}-${date}-${index}`),
    title: template.title[language],
    description: template.description[language],
    content: template.content[language],
    imageUrl: template.imageUrl || DEFAULT_IMAGE,
    url: `https://example.com/pulsewire/${hashString(`${template.title.en}-${index}`)}`,
    sourceName: template.sourceName,
    publishedAt: `${date}T${hour}`,
    category: template.categories[0],
    region: template.region,
    language,
  };
}

function filterByCategory(article: NewsArticle, request: FeedRequest) {
  const template = templates.find((item) => item.sourceName === article.sourceName && item.title[request.language] === article.title);

  if (!template) {
    return false;
  }

  if (request.searchQuery) {
    const query = request.searchQuery.toLowerCase();
    return `${article.title} ${article.description} ${article.sourceName}`.toLowerCase().includes(query);
  }

  if (request.category === 'home' || request.category === 'showcase') {
    return true;
  }

  if (request.category === 'for-you') {
    if (!request.interestKeywords.length) {
      return ['technology', 'business', 'india', 'health'].some((category) =>
        template.categories.includes(category as NewsArticle['category'])
      );
    }

    return request.interestKeywords.some((keyword) =>
      `${article.title} ${article.description}`.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  if (request.category === 'following') {
    return request.followedSources.includes(article.sourceName);
  }

  return template.categories.includes(request.category);
}

export async function fetchMockFeed(request: FeedRequest): Promise<FeedResponse> {
  const items = templates
    .map((template, index) => buildMockArticle(template, request.language, request.date, index))
    .filter((article) => filterByCategory(article, request));

  const sorted = dedupeArticles(items).sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt)
  );
  const start = (request.page - 1) * request.pageSize;
  const articles = sorted.slice(start, start + request.pageSize);

  return {
    articles,
    totalArticles: sorted.length,
    fromCache: false,
  };
}
