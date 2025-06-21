---
title: Versioning with Material for Mkdocs
description: An oddly undiscovered piece of land
pubDate: 2025-06-14
tags:
  - mkdocs
  - software
  - tips
layout: ../../../layouts/PostLayout.astro
---

Recently I've managed to move the documentation for one of my Minecraft mod to [Material for Mkdocs](https://squidfunk.github.io/mkdocs-material/).

I had a relatively smooth-sailing experience and I am quite satisfied with the outcome. Unfortunately I've spent quite a while figuring out how exactly does multi-versioning work in **Material for Mkdocs** with almost no results from Google Search (Apart from Material for Mkdocs's own documentation and the README of Mike, both of which focuses a little more on the implementation side), so I thought it'd be neat to at least have a higher level breakdown of how it works and the limitation of it.

# Introduction
Neither **Material for Mkdocs** nor **Mkdocs** handles versioning by themselves. Instead, it requires a separate project called [Mike](https://github.com/jimporter/mike), which is a separate CLI utility to deploy multiple version of your docs.

To understand how Mike works, we need to first understand how a Mkdocs website gets deployed first:

As Mkdocs is a **Static Site Generator**, all your markdown will be converted into static html files on build, which can then be served on any webserver.  
If you run `mkdocs build` on your documentation right now, you will notice that there is a new folder called `site` in your documentation's directory. This contains all the static html files needed to run the page, and you can copy all the contents inside to a webserver and have the documentation up and running.

However chances are that most smaller project will just use **GitHub Pages** instead to publish their docs. For that Mkdocs offers a convenient shortcut to do so: `mkdocs gh-deploy`. You can think of it as:
- Run `mkdocs build`
- Committing that folder to the root directory of your `gh-pages` branch
- Pushing the commit to remote (GitHub in this case).

This command is also the one used in [the GitHub workflow file](https://squidfunk.github.io/mkdocs-material/publishing-your-site/?h=github+action#with-github-actions) mentioned in the Material for Mkdocs documentation, and that's how your docs automagically gets updated whenever you push to github.

Still following? Good, now onto how **Mike** works:  
Think of it as a slightly different command line application that replaces `mkdocs gh-deploy`, and it allows you to configure the subdirectory you want the docs to be deployed.

As an example you can run `mike deploy 0.2`. Mike will then perform a `mkdocs build`. After the build is complete, it will put the build content under the subfolder `0.2`, and then commit that subfolder to the `gh-pages` branch, so your visitors will be able to access that version in `https://xxx.github.io/docs/0.2`.

In other words, <u>it allows multiple copies of your deployed docs to co-exists, but it does not handle versioning</u>.

In-fact you can do this manually by literally building the site yourself and manually copy the folder under the subdirectory. Well of course you're not gonna get the version switcher that **Material for Mkdocs** offers, but the core concept is still the same (And you can always make it with some HTML/CSS/JS :D)

So the idea is rather simple, but this may raise some questions:

**Q: How will `mkdocs serve` handle multiple versions?**  
**A:** Nope it doesn't! You'll only see the current version that's in your working tree, unfortunately this is a limitation of how it currently works.  
While **Mike** also offers its own `serve` command (`mike serve`) to preview a multi-versioned site, it only serves the deployed version in the `gh-pages` branch, so you can't use this for live updating.

**Q: Why is it `gh-pages` branch, what if I don't use GitHub pages?**  
**A:** **Mike** seems to be primarily targeting docs built with GitHub pages (As evident by the default branch being `gh-pages`), however you can specify a different branch by appending a `-b` or `--branch` flag specifying the branch. There is also other flags as stated in [Mike's README](https://github.com/jimporter/mike#usage) to customize the behaviour further!

**Q: Can I maintain multiple versions of my docs then? It seems to be made for pushing once and forget about it**  
**A:** Yes! As mentioned earlier mike doesn't handle versioning by itself, fortunately however we already have a pretty solid versioning system that is **Git**. You can just create a new git branch and maintain multiple versions of your docs. You can then run `mike deploy` with the corresponding version number and it will deploy the contents of whatever branch you are in to that subdirectory, without touching other docs.

# Implementation
Generally you can follow the tutorial over at [Material for Mkdocs' Documentation](https://squidfunk.github.io/mkdocs-material/setup/setting-up-versioning/) by appending the following to `mkdocs.yml`:
```yml
extra:
  version:
    provider: mike
```

Unlike what their docs says however (Which mentions **This renders a version selector in the header**), the version selector *will not appear* unless you have already deployed a version with mike and are using `mike serve`. Therefore we first need to deploy our docs with mike.

## Deploying with Mike
*From now on we'll assume you're deploying on GitHub pages and therefore will use the `gh-pages` branch, please append the appropriate flag if you are deploying to a custom branch.*

To get started, first we need to install **Mike** with `pip install mike`.

Then we need to first make sure that our existing `gh-pages` branch is clear.  
Remember `mkdocs gh-deploy`? If you have executed that before (Directly or indirectly via GitHub Actions) it would already have deployed our docs to the root directory, which is not what we want since we want the docs to be versioned within each subdirectory.

As such, we need to run `mike delete --all` to avoid mixing the unversioned & versioned docs.

Now we can finally deploy our first version:
```
mike deploy --push [version] [alias]
```
- `[version]` is your version name, pretty self explanatory.
- `[alias]` is a tag name that references your version.  
- - For example an alias could be `latest` or `stable`, then when you make a new version release, you can update the alias to point to that version, so people going to `https://example.com/latest` would only see your latest and greatest documentation!
- `--push` is a flag in mike that additionally does a `git push` so you don't have to. (`mkdocs gh-deploy` already does this by default)

And there you go, you now got your first version up on GitHub pages!

### Common Gotchas
#### Custom Domain
In the [documentation for Mkdocs](https://www.mkdocs.org/user-guide/deploying-your-docs/), it is mentioned that you need to add the `CNAME` file in your `docs` directory shall you wish to use a custom domain.

However Mike deploys your entire documentation in a subdirectory, so you would end up with your `CNAME` file getting put in the subdirectory, and then GitHub can't find it, and then it just no worky anymore.

To solve that, simply manually add a `CNAME` file to the root directory of your `gh-pages` branch. As mike only ever deploys within the subdirectory for each version, anything else in your `gh-pages` won't be deleted, so it's safe to just manually commit a file and push it.

#### Main page
Another thing you would've likely noticed is that your main page isn't accessible anymore, because everything is deployed into a subdirectory.

Mike does not support "having the latest version in the root directory, then alternate versions in a subdirectory", however you can at the very least redirect users to a particular version by setting a default version:

`mike set-default --push [alias]` (Replace `[alias]` with the alias you have)

This would automatically generate an **index.html** in the `gh-pages` branch which redirects users to the corresponding subdirectory.

## Making another version
If you want to contionously maintain your existing version (Say you want to create `3.0` but `2.0` is still a maintained version, or you want to go back and create `1.0` for reference), then you can just make a new git branch for the version you are about to create, edit the docs just like you would in Mkdocs, and finally do `mike deploy --push [version name here]`.

If you want to update an alias (Say you published a new version and want to update the `latest` alias to your new version), then you need to do:  
`mike deploy --push --update-alias [version name here] [alias]`

*Note that without `--update-alias`, it would only allow you to publish a new alias and disallows you from updating existing ones.*

## Deploying via GitHub Actions
The workflow file is mostly the same from a regular non-versioned mkdocs, apart from the fact that you would need to install mike, and replace the `mkdocs gh-deploy` command with mike:

```diff
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Configure Git Credentials
        ...
      - run: echo "cache_id=$(date --utc '+%V')" >> $GITHUB_ENV 
      - uses: actions/cache@v4
        with:
          ...
      - run: pip install mkdocs-material 
+     - run: pip install mike
-     - run: mkdocs gh-deploy --force
+     - run: mike deploy --push [alias]
```

# After-thoughts
So here is around 1K words of me yapping Versioning in Material for Mkdocs/Mkdocs. How much will this help anyone? I honestly have no idea.

**Material for Mkdocs** is pretty good at writing something in the config and have it work nicely with almost everything else. Unfortunately versioning is this one part where it *appears* as yet another easy toggle judging from the docs, but requires deeper understanding of Mike first before you use it. Even then you still can't preview multiple versions at the same time, it just doesn't integrate as well as most other offerings by Material for Mkdocs.

Curiously I rarely comes across any site built with **Material for Mkdocs** site with multi-versioning setup. It could just be me not looking hard enough, but I also feel like it may just be a bit too non-trivial to set-up?  
That said however, Mike is great for what it tries to do, and **Material for Mkdocs** also seems to be working on versioning (Which I am looking forward to!). Maybe if I am to write the docs I would've named it `Mike Integration` or something like that? But either way it's not important, I've figured it out and I hope you would have figured it out as well ^^