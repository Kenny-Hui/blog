import rss from '@astrojs/rss';
import { Constant } from '../../constant';
import { getPostLink } from '../../components/PostCard.astro';

export async function GET(context) {
  const postFiles = Object.values(import.meta.glob('../blog/**/*.{md,mdx}'));
  const posts = [];

  for(let postFile of Object.values(postFiles)) {
    let post = await postFile();
    posts.push(post);
  }

  return rss({
    title: Constant.brand,
    description: Constant.description,
    site: Constant.url,
    items: await Promise.all(
      posts.map(async e => {
        return {
          title: e.frontmatter.title,
          description: e.frontmatter.description,
          link: Constant.url + getPostLink(e),
          pubDate: e.frontmatter.pubDate,
          author: Constant.author,
          content: e.compiledContent ? await e.compiledContent() : undefined // Can't render stuff in MDX
        };
      }),
    ),
    customData: `<language>en-us</language>`,
  });
}