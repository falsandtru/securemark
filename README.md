# Securemark

[![Build Status](https://travis-ci.org/falsandtru/securemark.svg?branch=master)](https://travis-ci.org/falsandtru/securemark)
[![Coverage Status](https://coveralls.io/repos/falsandtru/securemark/badge.svg?branch=master&service=github)](https://coveralls.io/github/falsandtru/securemark?branch=master)
[![Dependency Status](https://gemnasium.com/falsandtru/securemark.svg)](https://gemnasium.com/falsandtru/securemark)

Secure markdown renderer working on browsers for user input data.

## Feature

- Secure dom rendering.
- Declarative syntax.
- Recursive parsing.
- Incremental update.
- Unblinking rendering.
- Large document support.
- LaTeX support with MathJax.

## Demo

https://falsandtru.github.io/securemark/

## API

[index.d.ts](index.d.ts)

## Syntax

[markdown.d.ts](markdown.d.ts)

- Heading (#)
- UList (-)
- OList (1.)
- DList (~)
- Table (| |)
- Blockquote (>, |>)
- Preformattedtext (```)
- HorizontalRule (---)
- Inline markups (*, ~~, `, \[](), !\[](), (()), ...)
- Inline html tags (\<smal>, \<ruby>, \<code>, ...)
- Autolink (https://host, ttps://host, #section, !https://host/image.png, @account)
- Index (# title [#section])
- Media (!https://host/image.png, !https://youtu.be/..., !https://gist.github.com/...)
- Syntex highlight (```lang filename)
- LaTeX ($expr$, $$expr$$)

## Media

- Twitter
- YouTube
- Gist
- SlideShare
- PDF
- Images

## Dependency

- PrismJS
- MathJax
- jQuery (for Ajax)

## Browser

- Chrome
- Firefox
- Edge
- Safari
- https://cdn.polyfill.io
