import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '@/site.config';

export async function GET(context: { site: string }) {
  const posts = await getCollection('posts', ({ data }) => {
    return !data.draft;
  });

  const sortedPosts = posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
