# Securemark

![CI](https://github.com/falsandtru/securemark/workflows/CI/badge.svg)

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
- Figure, Annotation, and Reference syntax.
- Index generation for headings, terms, and figures.
- Shortlink syntax for local references of indexes and figures.
- Auto numbering of figures, annotations, and references.
- Cross reference generation for annotations and references.
- Table of contents.

## Demos

https://falsandtru.github.io/securemark/

## APIs

[index.d.ts](index.d.ts)

## Syntax

[markdown.d.ts](markdown.d.ts)

- Heading (#)
- UList (-)
- OList (1., I., A., A-1., (1), (i), (a)-1)
- DList (~)
- Table (| |)
- Blockquote (>, !>)
- Preformattedtext (```)
- HorizontalRule (---)
- Inline markups (*, `, []{}, {}, ![]{}, !{}, \[](), ++, ~~, (()), ...)
- Inline HTML tags (\<small>, \<bdi>, ...)
- Autolink (https://host, user@host, @user)
- Shortmedia (!https://host/image.png, !https://youtu.be/...)
- Syntex highlight (```lang filename)
- LaTeX ($expr$, ${expr}$, $$)
- Index (# title [#indexer], ~ term [#indexer], [#index])
- Figure (~~~figure $fig-name)
- Label ($fig-name, [$fig-name])
- Annotation (((annotation)))
- Reference ([[reference]])
- Channel (@user#tag)
- Hashtag (#tag)
- Template ({{ template }})
- Comment ([% comment %])

## Media

- Twitter
- YouTube
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

- Chrome
- Firefox
- Edge (Chromium edition only)
- Safari

## License

Free to use this product only for private or offline usage under the Mozilla Public License 2.0 and the Apache License 2.0.
