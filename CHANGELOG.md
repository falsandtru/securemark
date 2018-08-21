# Changelog

## 0.79.1

- Fix cached tweet rendering.
- Fix cache miss in media rendering with relative path.

## 0.79.0

- Disallow media in index syntax.
- Cache the results of rendering with all media.
- Fix cache control interface.

## 0.78.4

- Refactoring.

## 0.78.3

- Improve linebreak handling.

## 0.78.2

- Refactoring.

## 0.78.1

- Allow tailing whitespace in index syntax.

## 0.78.0

- Disallow leading whitespace in annotation, authority, link, media, emphasis, strong, and math syntax.
- Escape insecure characters.

## 0.77.0

- Allow HTML attributes.
- Remove `cite` HTML tag.

## 0.76.0

- Refine syntax structure design.
  - Move annotation, authority, account, and hashtag syntax into inblock syntax.
- Add channel syntax.
- Disllow trailing `#` with hashtag syntax.
- Disllow trailing `@` with account syntax.

## 0.75.0

- Allow trailing `@` with account syntax.
- Remove figure function's header formatter injection.

## 0.74.3

- Refactoring.

## 0.74.2

- Fix blockquote parser.

## 0.74.1

- Fix figure parser.
- Fix media parser in figure syntax.

## 0.74.0

- Allow example syntax in figure syntax.
- Fix markdown example parser.
- Fix lightweight figure parser to parse blockquote syntax including extension syntax.

## 0.73.0

- Add example syntax.
- Refine extended link and media syntax to allow URI including parenthesises.
- Reserve attribute schema of media syntax.
- Reserve attribute schema of math syntax.
- Allow empty URI in media syntax.
- Allow leading and trailing whitespace around URI in link and media syntax.
- Allow invalid arguments of syntax and mark as invalid.
- Remove escape function.

## 0.72.0

- Remove `mark` HTML tag.
- Parse HTML syntax of invalid tags using another parser.
- Parse invalid index and label syntax using another parser.
- Set index number of headings for TOC.
- Remove some trailing symbols in references of figures.

## 0.71.1

- Don't use the current abstract URI to visualize empty URI.

## 0.71.0

- Exclude blockquote elements from the target of the contextual features.
- Don't count hyphens of HTML comment out syntax.

## 0.70.0

- Extend figure function.

## 0.69.0

- Add authority syntax.
- Refine footnote function.

## 0.68.0

- Allow to put `$` symbol after math syntax.
- Decode URI only on displaying.
- Remove invalid surrogate pairs.

## 0.67.0

- Allow empty lines in math syntax.
- Allow leading and trailing whitespace in math syntax.

## 0.66.0

- Allow media syntax in figure syntax.

## 0.65.1

- Fix figure function.
  - Fix numbering of figure elements.
  - Don't require group index in reference.

## 0.65.0

- Fix link, media, and url parser.
  - Don't escape any character by `\`.

## 0.64.0

- Remove control characters.
- Fix link text constraints.

## 0.63.1

- Disallow link text starting with `@`.

## 0.63.0

- Parse as extension before parsing as link.
- Disallow link text starting with `#`.

## 0.62.0

- Allow invalid HTML tags with replacing.
- Don't translate the text of code and math.

## 0.61.0

- Allow tel protocol in link syntax.
- Refine rendering options.

## 0.60.0

- Disallow ulist syntax without `-`.

## 0.59.0

- Disallow figure name starting with numbers.
- Revert removing linebreaks after `wbr` HTML tag.

## 0.58.0

- Localize linebreak processing.
- Insert wbr element with linebreak.
- Remove linebreaks after `wbr` HTML tag.

## 0.57.0

- Add lightweight figure syntax.

## 0.56.0

- Change reference parser to accept only lower-case alphanumeric characters.
- Extend reference parser to add nest level.
- Extend label parser to support equation numbering.

## 0.55.0

- Extend hashtag parser to add tag level.
- Extend comment syntax to add HTML comment syntax.

## 0.54.0

- Allow blockquote syntax in figure syntax.
- Improve figure parser with pretext syntax.

## 0.53.0

- Allow list nesting with no content.
- Disallow media in heading, ulist, olist, dlist, and table syntax.

## 0.52.2

- Allow empty table row.

## 0.52.1

- Fix table parser.

## 0.52.0

- Refine table parser.

## 0.51.0

- Allow image link in link.

## 0.50.0

- Unify the same footnotes.

## 0.49.0

- Allow empty blockquote.
- Fix nested blockquote.

## 0.48.0

- Change markdown rendering flag of blockquote syntax.

## 0.47.0

- Require tables to put body contents.
- Don't use align attribute in tables.

## 0.46.1

- Allow trailing newline in figure syntax.
- Allow empty nested blockquote.

## 0.46.0

- Always open a media link in new tab.
- Allow whitespace in indexer.
- Remove local text parsing rules.
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
- Remove `q` HTML tag.

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
  - Don't escape URI after `@` symbol.
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

- Add `ins`, `del`, `sup`, and `sub` HTML tags.
- Remove insertion, deletion, superscript, and subscript syntax.
- Remove `code` HTML tag.
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
- Fix media URI parsing.

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
- Allow only lower case HTML tags.
- Disallow empty contents.

## 0.13.0

- Refine annotation parser.

## 0.12.1

- Fix package settings.

## 0.12.0

- Enhance bind function.

## 0.11.0

- Remove `dfn`, `abbr`, `samp`, `kbd`, `data`, `time`, and `var` HTML tags.

## 0.10.0

- Add insertion syntax.
- Change strike to deletion syntax.
- Remove `ins`, `del`, `sup`, and `sub` HTML tags.
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
- Remove `u` HTML tag.
- Improve HTML parser.
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
- Allow `wbr` HTML tag.
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
