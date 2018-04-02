# Changelog

## 0.46.0

- Always open a media link in new tab.
- Allow whitespace in indexer.
- Refactoring with some small breaking changes.

## 0.45.0

- Extend bracket parser for `"`.

## 0.44.2

- Refactoring.

## 0.44.1

- Fix paragraph parser for hashtag parser.

## 0.44.0

- Add comment syntax.
- Disallow nested annotations and media in annotations.

## 0.43.1

- Improve index parser.
  - Standardize indexes to lower case.

## 0.43.0

- Add figure syntax.
- Add label syntax.
- Add figure function.
- Add footnote function.
- Refine horizontalrule syntax.
- Fix hashtag parser.
- Remove `q` html tag.

## 0.42.1

- Fix the copyright notice.

## 0.42.0

- Add toc function.
- Extend bind function signature.

## 0.41.1

- Improve index parser.
  - Allow trailing whitespace.

## 0.41.0

- Add reference syntax.
- Refine hashtag syntax.
- Markup newline characters.

## 0.40.0

- Add hashtag syntax.
- Improve url parser.
  - Allow escaped whitespace.
- Improve account parser.
  - Don't escape url after `@` symbol.
  - Use anchor element.

## 0.39.1

- Fix url parser.
  - Support IPv6 addresses.
  - Fix rules of trailing symbols detection.
- Fix escape function.

## 0.39.0

- Improve bind function to be reentrant.
- Remove extended syntax of link and media.

## 0.38.3

- Fix pretext parser.
- Fix link and media parsers.

## 0.38.2

- Fix url parser.

## 0.38.1

- Fix index parser.

## 0.38.0

- Support video and audio media.
- Refine rendering options.
- Fix math parser.

## 0.37.1

- Fix index parser.

## 0.37.0

- Compile to es2016.

## 0.36.1

- Optimization.

## 0.36.0

- Support progressive rendering.
- Refine bind function.

## 0.35.3

- Optimization.

## 0.35.2

- Refactoring.

## 0.35.1

- Refactoring.

## 0.35.0

- Extend pretext syntax to allow any language and filename.

## 0.34.10

- Fix link parser.

## 0.34.9

- Fix link parser.

## 0.34.8

- Refactoring.

## 0.34.7

- Refactoring.

## 0.34.6

- Fix emphasis parser.
- Fix code parser.

## 0.34.5

- Update Tweet renderer.

## 0.34.4

- Improve error messages.

## 0.34.3

- Fix pretext parser.

## 0.34.2

- Revert local text parsing rules.
- Fix newline parsing.

## 0.34.1

- Fix media rendering.

## 0.34.0

- Add escape function.
- Disallow `_` in account names.
- Remove local text parsing rules.
- Use DOMPurify.

## 0.33.0

- Add `ins`, `del`, `sup`, and `sub` html tags.
- Remove insertion, deletion, superscript, and subscript syntax.
- Remove `code` html tag.
- Improve parsing with brackets.
- Fix parsing with strong and emphasis syntax.

## 0.32.0

- Change schema of caches.

## 0.31.0

- Improve image rendering function interface.

## 0.30.1

- Fix RenderingOptions interface.

## 0.30.0

- Refine rendering options.

## 0.29.0

- Reserve symbol syntax.
- Extend extension syntax.
- Expose caches for custom renderer implementation.

## 0.28.0

- Add rendering options.
- Fix math syntax to disallow empty lines.

## 0.27.0

- Fix index syntax.

## 0.26.2

- Avoid a bug of PrismJS.

## 0.26.1

- Remove verbose code.

## 0.26.0

- Add syntax highlight.
- Fix cached math rendering.

## 0.25.0

- Add index syntax.
- Extend link syntax.
- Extend autolink syntax.
- Improve media rendering.
- Fix cached math rendering.
- Remove zalgo parser.

## 0.24.0

- Add rendering cache feature.

## 0.23.0

- Extend link syntax.
- Extend media syntax.
- Fix media url parsing.

## 0.22.0

- Add render function.
- Extend autolink syntax.

## 0.21.2

- Optimization.

## 0.21.1

- Refactoring.

## 0.21.0

- Extend blockquote syntax.
- Relax olist syntax.
- Fix constraints of list children.

## 0.20.0

- Change bind function design.

## 0.19.0

- Add math syntax.

## 0.18.0

- Add zalgo parser.

## 0.17.1

- Fix url processing.

## 0.17.0

- Accept bodiless incomplete table.
- Fix blockquote syntax.
- Extend ulist syntax.
- Extend bind function signature.

## 0.16.0

- Add autolink syntax.
- Improve link parser.
- Fix text parser.
- Squash multiple linebreaks.

## 0.15.0

- Enhance link parser.
- Improve annotation parser.
- Improve table parser.

## 0.14.0

- Refine link parser.
- Allow only lower case html tags.
- Disallow empty contents.

## 0.13.0

- Refine annotation parser.

## 0.12.1

- Fix package settings.

## 0.12.0

- Enhance bind function.

## 0.11.0

- Remove `dfn`, `abbr`, `samp`, `kbd`, `data`, `time`, and `var` html tags.

## 0.10.0

- Add insertion syntax.
- Change strike to deletion syntax.
- Remove `ins`, `del`, `sup`, and `sub` html tags.
- Improve parser algorithm.

## 0.9.0

- Extend pretext syntax.
- Extend extension syntax.
- Enhance table parser.
- Fix segment parser.
- Fix olist parser.

## 0.8.0

- Change license to Apache-2.0 AND MPL-2.0.
- Fix bind function.

## 0.7.0

- Add superscript syntax.
- Add subscript syntax.
- Remove `u` html tag.
- Improve html parser.
- Fix code parser.

## 0.6.0

- Refine dlist syntax.
- Refine olist syntax.
- Enhance table parser.

## 0.5.0

- Add dlist syntax.
- Improve table parser.

## 0.4.2

- Fix paragraph parser.

## 0.4.1

- Fix extension parser.

## 0.4.0

- Enhance pretext syntax.
- Add extension syntax.
- Allow `wbr` html tag.
- Fix segmentations.

## 0.3.1

- Fix horizontalrule parser.
- Fix ulist and olist parser.

## 0.3.0

- Add nofollow link syntax.
- Fix pretext language specification.

## 0.2.0

- Change parse function return type.

## 0.1.0

- Release.
