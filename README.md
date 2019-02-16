# Securemark

[![Build Status](https://travis-ci.org/falsandtru/securemark.svg?branch=master)](https://travis-ci.org/falsandtru/securemark)
[![Coverage Status](https://coveralls.io/repos/falsandtru/securemark/badge.svg?branch=master&service=github)](https://coveralls.io/github/falsandtru/securemark?branch=master)

Secure markdown renderer working on browsers for user input data.

## Features

- Secure DOM rendering.
- Declarative syntax.
- Recursive parsing.
- Incremental update.
- Progressive rendering.
- Unblinking rendering.
- Large document support.
- Syntax highlight with PrismJS.
- LaTeX rendering with MathJax.
- Figure, Annotation, and Authority syntax.
- Index generation for headings, terms, and figures.
- Shortlink syntax for local references of indexes and figures.
- Auto numbering of figures and footnotes.
- Footnote and its bidirectional reference link generation from annotations and authorities.
- Table of contents.

## Demos

https://falsandtru.github.io/securemark/

## APIs

[index.d.ts](index.d.ts)

## Syntax

[markdown.d.ts](markdown.d.ts)

- Heading (#)
- UList (-)
- OList (1.)
- DList (~)
- Table (| |)
- Blockquote (>, !>)
- Preformattedtext (```)
- HorizontalRule (---)
- Inline markups (*, `, []{}, {}, ![]{}, !{}, \[](), ++, ~~, (()), ...)
- Inline HTML tags (\<small>, \<bdi>, ...)
- Autolink (https://host, ttps://host, account@host, @account)
- Shortmedia (!https://host/image.png)
- Media (!https://host/image.png, !https://youtu.be/..., !https://gist.github.com/...)
- Syntex highlight (```lang filename)
- LaTeX (${expr}$, $$expr$$)
- Index (# title [#indexer], ~ term [#indexer], [#index])
- Figure (~~~figure [:fig-name])
- Label ([:fig-name])
- Data ([~name], [~name=value], [~name=value|text])
- Annotation (((annotation)))
- Authority ([[authority]])
- Channel (@account#tag)
- Hashtag (#tag)
- Template ({{ template }})
- Comment (<# comment #>)

## Media

- Twitter
- YouTube
- Gist
- SlideShare
- PDF (.pdf)
- Video (.webm, .ogv)
- Audio (.oga, .ogg)
- Images

## Graph

- [Sequence](https://github.com/bramp/js-sequence-diagrams)
- [Flowchart](https://github.com/adrai/flowchart.js)
- [Graphviz](https://github.com/mdaines/viz.js)

## Dependencies

- PrismJS
- MathJax
- jQuery (for Ajax)
- DOMPurify

## Browsers

Requires es6 and modern DOM API support.

- Chrome
- Firefox
- Edge
- Safari

Polyfill: https://cdn.polyfill.io
