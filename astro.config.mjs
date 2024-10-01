import { defineConfig } from 'astro/config';

import mdx from "@astrojs/mdx";
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import rehypeFigure from 'rehype-figure';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  site: "https://blog.lx862.com",
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      rehypeFigure, [rehypeAutolinkHeadings, {behavior: 'append'}],
      rehypeToc, [rehypeToc, {headings: ['h1', 'h2'], customizeTOC: (node) => {
        if(node.tagName == "nav" && node.children[0].children.length == 0) {
          return false; // Don't generate TOC if empty
        }

        const h4Node = { type: 'element', tagName: "p", properties: {className: "toc-text"}};
        h4Node.children = [
          {
            type: 'text',
            value: "Table of Content"
          }
        ];

        node.children = [h4Node, ...node.children]; // prepend
        return node;
      }}]
    ]
  },
});