---
title: Why your font may look different in UIs
description: Font Hinting.
date: 2023-03-06
hidden: true
tags:
  - software
  - fonts
hidden_reason: I need some way to bring to light that "yes the reason why your font looks crap is because of font hinting". Right now it just feels very cheap as I pretty much just sums up someone else's article, but at the same time it would be weird to say "Yes it's because of font hinting, check it out on <URL>"

srcnote: "If I tell you I figured this out all by my own I would be a god at this point. Please check out the following sources:"
srcs:
  - "[Font hinting from first developments to use in practice](https://typetype.medium.com/font-hinting-from-first-developments-to-use-in-practice-8643c7925478)"
---
{% include "src.njk" %}
If you make stuff on the web, or you need to put some nice looking font onto maybe your WinForm/WPF applications on Windows, you might have noticed that the font looks... off.  

It isn't unreadable, but it just ruins the aesthetic, and in some rare cases it makes it even harder to read.

{% image "./test.png", "" %}

I am hit with this situation a few months ago when I need to make a webpage and the font looks very unpleasing, despite knowing fully well that the font definitely looks better.

This isn't the first time I've noticed this, but it's genuinely <span class="ARGH">gut wrenching</span> on how my supposedly good looking fonts looks absolutely crap when I put it on my webpage, but not if I for example, use it in Paint.NET or Photoshop.  

As any other human would do I asked **Mr. Google**, but to my surprise I didn't really get any relevant answer at all.  
(Not because there's no answer, but just that I didn't use the appropriate keyword as I have 0 idea about any font rendering stuff prior to this).

So I decided to fire up a macOS and Linux VM and see how each performs.

Unsurprisingly macOS doesn't have this issue (It's Apple afterall), but Linux doesn't have the same problem either.

Yes macOS and Linux still looks different, but the point is they all won't deform the font to the degree that Windows does, so this is clearly a Windows specific issue?

# Font Hinting
Better represented as "grid-fitting", it is a process that deforms the font to make the glyph aligns to the pixels on your monitor.

This is especially important before anti-aliasing exists, as one misplaced pixel could heavily affect the outlook of the font.

Even after anti-aliasing becomes the norms, Font Hinting is still used to improve the "Crispness" of the fonts.

This could however, as mentioned, alter the shape of the font, which is not always welcomed by graphics designer, or even just people wanting their fonts to look nice.

As the font gets smaller, even snapping 1 pixel matters alot, and that's why fonts generally look different (Better or Worse) on different sizes with Font Hinting.

## Windows
Microsoft favors <span class="highlight">readability</span> over <span class="aesthetics">aesthetics</span>, as such ClearType (The technology Windows uses to smoothen fonts) uses Very Strong <span class="hint">font hinting</span> to ensure the fonts looks crisp, even if it means the fonts will end up getting deformed.

While it is meant to improve readability by making fonts crispier (And it does in most cases), it could end up backfiring.

For example with **Noto Sans TC** (in Chinese) and **GG Sans** (Discord's new font), both doesn't render well and are not aesthetically pleasing on Windows and may even hurt readability in some cases.

This also makes Cleartype remain controversial as it ruins the aesthetic of a fonts, which will certainly trigger graphics and font designer.

**There's no way to reduce or disable font hinting with ClearType as far as I know**.

There are 3rd party programs like [MacType](https://www.mactype.net) that aims to solve this, however from my experience it needs quite a bit of tweaking to get it right and it still feels a bit weird.

## macOS
macOS on the other hand does not use any font hinting, at all. 

This means that fonts on macOS are generally blurrier than say maybe Windows, but the font will always retain the same shape on all sizes, printed or not.

It has also became less of a problem as Apple switches to using HiDPI display, which makes the blurriness less visible.

## Linux
It depends, most DE have an option to tweak the font hinting.  
I completely turned it off as I think the way the font looks is above just crispiness.

The truth is there's not one solution everyone can agree on, you either have to trade for quality or crispiness (Note crispiness != clarity).  

The only win win solution as far as I can tell is to really just buy a HiDPI screen, and in fact this is the only reason why I might want anything higher than 1080p.  
I am clearly not the type of professional guy who would zoom in and appereciate each pixels, but when it comes to font rendering stuff it really matters.

If you are REALLY desparate to get rid of the font hinting specifically for your Applications / Webpage, then your best bet is just to put the text in an image. (Or you can go the pain way and render the text entirely by your custom code). Be very wary of accessibilities issues though!