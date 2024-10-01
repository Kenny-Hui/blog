---
title: I rebuilt the blog again
description: This time in Astro!
pubDate: 2024-10-16
tags:
  - meta
layout: ../../../layouts/PostLayout.astro
---

[Last time I rewrote this blog in 11ty](/blog/2023-04-02-I-rebuilt-the-blog). Unfortunately it slowly ended up being a tech debt, which I think can mostly be attributed to:
- Using a template instead of setting up from scratch
- - Lack of understanding on how 11ty actually works, hitting my head for the 800th time
- [The Nunjucks Templating Language](https://mozilla.github.io/nunjucks/)
- - No good code editor support.
- - Relatively niche language outside of 11ty.
- - The syntax is a bit verbose to my likings.
- [11ty's documentation](https://www.11ty.dev/docs)
- - The documentation part is fine, but as a newcomer it feels really overwhelming having all the information sholved at you all at once.
- 11ty is just a Do-It-Yourself site generator
- - Many things (Down to even bundling css/js) are simply left up-on you to add
- - Good for very fine-grained control, but otherwise feels tedious to setup.

That's not to say 11ty is a bad static-site generator, it just doesn't cater towards my need/goal, which is *completely fine*. At the end of the day, the best tools are the tools that you find the best for your use-case.  
Now I just gotta find mine...

---

Recently I've came across [this blog post](https://garnix.dev/posts/blog_using_astro/) documenting their experience with building their blog in [Astro](https://astro.build). This peaked my interest as for a while now I am looking to rewrite my absolute mess of a blog to something else.

When I first heard of Astro, I didn't even pay attention to it and I just put it in the long list of "yet another overcomplicated JS Frameworks I'll never use", but honestly after seeing some sample code I am quite sold. Here's one example:  
```astro
---
const name = "LX86"; // Server-side JS, executed on build-time
---
<p>Hi, I am {name}, I think... <span id="wa"></span></p>

<script> // Client-side JS, executed by browser when page loads
document.querySelector("#wa").textContent = ">.<"
</script>
```

Which gets transpiled to:
```astro
<p>Hi, I am LX86, I think... <span id="wa"></span></p>

<script>
document.querySelector("#wa").textContent = ">.<"
</script>
```

<sub>**Output: Hi, I am LX86, I think... &gt;.&lt;**</sub>  

I like this approach as it clearly seperates server-side JS and the rest of the page/client-side JS, while keeping them all in one place. But more importantly as you may have noticed, it does not ships any JS that I don't explicitly write.

### 0 (Client) Javascript out of the box
While JS are very commonly used across the web, I still don't believe in a world where JS is mandatory to view *static* informations.  
This is something that Astro has promised, and I like that promise.  
Just because most of the visitors *can* run Javascript doesn't give you the justification to do so. Access to static information *should never* require Javascript

I am not exactly sure whether other framework (Like Next) does this, but at least Astro does give me that guarentee of not shipping JS that I don't write. (But have the ability to easily write them shall I need to)

### Image Optimization by default
I don't really care nor have an interest to care about image optimizations. I am not a performance geek and I am not here to squeeze out every bit I can save.  
*That said* it's always nice to reduce the bandwidth whenever possible. Fortunately Astro processes assets by default with the &lt;Image> tag, or automatically done if using the markdown image syntax.

That's neat! Sometimes I just want a platform that automatically takes care of the "blogging stuff", while leaving up to me on how I want my page to look.

# Current Blog Setup
Right now the blog is written in Astro:
- With either markdown or mdx via [@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/) for blog post.  
- RSS is powered by [@astrojs/rss](https://docs.astro.build/en/guides/rss/)  
- Anchor link heading is powered by [rehype-autolink-headings](https://github.com/rehypejs/rehype-autolink-headings) + [rehype-slug](https://github.com/rehypejs/rehype-slug)
- Image caption is powered by [rehype-figure](https://github.com/Microflash/rehype-figure)  
- Table of Content is powered by [rehype-doc](https://github.com/JS-DevTools/rehype-toc), with a bit of JS added to highlight the current heading and CSS to make it float on desktop.
- Deployed to GitHub Pages via GitHub action

As a bonus, I redesigned the look of the blog so it looks less 2009, and replicated the link format from my old blog so existing link doesn't rot~

That's about it! I think I am quick happy with the switch overall, you can view the source code [here](https://github.com/Kenny-Hui/blog).  
Unfortunately I don't think there is a cure for the absolute disaster of the Javascript Ecosystem that is, so that will have to live :<