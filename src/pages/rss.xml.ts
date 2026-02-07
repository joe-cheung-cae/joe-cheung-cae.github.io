import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/site.config';
import { getBaseUrl } from '@/utils/deployment';

export async function GET(context: { site: string }) {
  const posts = await getCollection('posts', ({ data }) => {
    return !data.draft;
  });

  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  const baseUrl = getBaseUrl() === '/' ? '' : getBaseUrl();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.siteUrl,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `${baseUrl}/blog/${post.slug}/`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
