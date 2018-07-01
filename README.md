# Securemark

[![Build Status](https://travis-ci.org/falsandtru/securemark.svg?branch=master)](https://travis-ci.org/falsandtru/securemark)
[![Coverage Status](https://coveralls.io/repos/falsandtru/securemark/badge.svg?branch=master&service=github)](https://coveralls.io/github/falsandtru/securemark?branch=master)
[![Dependency Status](https://gemnasium.com/falsandtru/securemark.svg)](https://gemnasium.com/falsandtru/securemark)

Secure markdown renderer working on browsers for user input data.

## Features

- Secure DOM rendering.
- Declarative syntax.
- Recursive parsing.
- Incremental update.
- Progressive rendering.
- Unblinking rendering.
- Syntax highlight with PrismJS.
- LaTeX support with MathJax.
- Large document support.
- Index generation for headings, terms, and figures.
- Shortlink syntax for local references of indexes and figures.
- Auto numbering of figures and footnotes.
- Footnote and its bidirectional link generation from annotations.
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
- Inline markups (*, ~~, `, \[](), !\[](), (()), ...)
- Inline html tags (\<smal>, \<ruby>, \<code>, ...)
- Autolink (https://host, ttps://host, !https://host/image.png, @account)
- Media (!https://host/image.png, !https://youtu.be/..., !https://gist.github.com/...)
- Syntex highlight (```lang filename)
- LaTeX ($expr$, $$expr$$)
- Figure (~~~figure [:fig-name])
- Label ([:fig-name])
- Annotation (((annotation)))
- Index (# title [#section], ~ term [#term], [#some words])
- Hashtag (#tag)
- Comment (<# comment #>, \<!-- comment -->)

## Media

- Twitter
- YouTube
- Gist
- SlideShare
- PDF (.pdf)
- Video (.webm, .ogv)
- Audio (.oga, .ogg)
- Images

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
