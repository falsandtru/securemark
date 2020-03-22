# Changelog

## 0.151.0

- Extend account syntax to be possible to clarify the namespace.
- Change hashtag syntax to disallow strings starting with a number.
- Change reference syntax to enable extension syntax.

## 0.150.0

- Change the format of figure numbers.

## 0.149.1

- Fix media, template, and url parsers to correctly parse contained text.

## 0.149.0

- Change template parser not to parse contained text as Markdown.

## 0.148.8

- Refactoring.

## 0.148.7

- Refactoring.

## 0.148.6

- Refactoring.

## 0.148.5

- Refactoring.

## 0.148.4

- Refactoring.

## 0.148.3

- Refactoring.

## 0.148.2

- Refactoring.

## 0.148.1

- Refactoring.

## 0.148.0

- Refactoring.

## 0.147.4

- Limit the max size of an id to 100.

## 0.147.3

- Refactoring.

## 0.147.2

- Refactoring.

## 0.147.1

- Fix HTML parser to disallow annotation and reference parsers in `sup` or `sub` HTML tag.
- Fix annotation and reference parsers to reset the state of HTML parser.

## 0.147.0

- Refine parsers to manage backtracking.
- Limit the max size of a block to 10,000.

## 0.146.2

- Optimization.

## 0.146.1

- Enhance footenote processing.

## 0.146.0

- Add alias syntax into reference syntax.

## 0.145.0

- Rename ParserSettings.footnote to ParserSettings.footnotes.

## 0.144.2

- Optimization.

## 0.144.1

- Optimization.

## 0.144.0

- Hide figure function and footnote function.
- Change bind function also to yield figure links.
- Change bind function also to yield footnote links.
- Change bind function also to yield added and removed list items of footnotes.

## 0.143.3

- Fix parsers to be possible to handle invalid URL.

## 0.143.2

- Optimization.

## 0.143.1

- Refactoring.

## 0.143.0

- Add mark syntax.

## 0.142.2

- Refactoring.

## 0.142.1

- Fix concurrency bugs of bind function.

## 0.142.0

- Change bind function to yield `undefined` to express the abort of the iteration.

## 0.141.10

- Refactoring.

## 0.141.9

- Refactoring.

## 0.141.8

- Fix heading parser to allow empty texts.

## 0.141.7

- Refactoring.

## 0.141.6

- Refactoring.

## 0.141.5

- Fix index parser to allow any text.
- Fix index parser to ignore rubies.

## 0.141.4

- Fix link and media parser to avoid conflict with template syntax.

## 0.141.3

- Fix link parser to disable extension syntax.

## 0.141.2

- Fix link parser to disable annotation and reference syntax.

## 0.141.1

- Fix link parser not to include linkable texts.

## 0.141.0

- Change index parser to replace whitespace with `_` instead of `-`.
- Recover from exceptions in parsing.

## 0.140.0

- Change bind function to also yield removed elements.

## 0.139.3

- Refactoring.

## 0.139.2

- Fix bind function.

## 0.139.1

- Refactoring.

## 0.139.0

- Change segment separator to empty lines only.

## 0.138.1

- Fix end of line processing.

## 0.138.0

- Change the handling of too large blocks to replace blocks with error messages.

## 0.137.1

- Refactoring.

## 0.137.0

- Change paragraph parser not to remove blocks having comments only.

## 0.136.4

- Refactoring.

## 0.136.3

- Refactoring.

## 0.136.2

- Refactoring.

## 0.136.1

- Refactoring.

## 0.136.0

- Change the nested syntax handling of insertion, deletion, emphasis, and strong syntax.

## 0.135.1

- Refactoring.

## 0.135.0

- Limit the max size of a block to 100,000.
- Fix address parser.

## 0.134.0

- Change HTML parser to allow any size of leading and trailing whitespace.
- Change HTML parser not to remove leading and trailing whitespace.
- Fix HTML parser to parse entire invalid HTML syntax including closing tags.

## 0.133.1

- Optimization.

## 0.133.0

- Refine syntax control.
- Change license.

## 0.132.2

- Optimization.

## 0.132.1

- Change a syntax name from quote to quotation.
- Fix paragraph parser to break lines around mention syntax.

## 0.132.0

- Add context function.
- Change bind function's parameters to be required.
- Fix render function.

## 0.131.1

- Fix figure parser to mark results invalid instead of failing to parse.

## 0.131.0

- Change heading syntax to allow to be written continuously without separating them by blank lines.

## 0.130.0

- Change link syntax to allow texts starting with `#` or `@`.
- Change label syntax to limit the max figure number level to 3.

## 0.129.0

- Change a syntax name from authority to reference.
- Change numbering of figures not to inherit the label formats specified by themselves.
- Fix numbering of figures to have consistent increment patterns.

## 0.128.0

- Extend figure syntax to allow to reset the base number to 0 with the current format.
- Extend figure syntax to remove the constraints on the content and caption only when it is used for formatting.
- Enhance figure syntax to finely control the base number.

## 0.127.0

- Add info function.
- Extend hashtag syntax to allow to use tag names starting with numbers.

## 0.126.2

- Optimization.

## 0.126.1

- Fix footnote function.

## 0.126.0

- Change parse and bind functions to number figures by default.

## 0.125.6

- Fix figure syntax to remove the maximum number limitation of contained lines.

## 0.125.5

- Optimization.

## 0.125.4

- Fix context separation.

## 0.125.3

- Micro refactoring.

## 0.125.2

- Fix context separation.

## 0.125.1

- Fix figure function.
- Fix footnote function.

## 0.125.0

- Enhance figure function.

## 0.124.1

- Micro refactoring.

## 0.124.0

- Improve template parser.

## 0.123.5

- Update bind function interface.

## 0.123.4

- Fix linebreak control with annotation syntax.

## 0.123.3

- Micro refactoring.

## 0.123.2

- Micro refactoring.

## 0.123.1

- Micro refactoring.

## 0.123.0

- Extend address syntax to accept nofollow link syntax.
- Change address parser not to make a wrapper element.

## 0.122.0

- Change paragraph parser to parse mention syntax after texts.
- Fix autolink parser to convert newline into `br` HTML tag.

## 0.121.0

- Add hashref syntax.
- Fix autolink parser.

## 0.120.0

- Change linebreak control.

## 0.119.1

- Fix media parser always to make a link which open a new tab.

## 0.119.0

- Extend some APIs to accept ShadowRoot.
- Change figure function to make by-name links.

## 0.118.1

- Fix email parser.

## 0.118.0

- Change email parser to be stricter.

## 0.117.1

- Fix typings.

## 0.117.0

- Remove graph syntax.

## 0.116.0

- Enhance codeblock parser to allow to put a filename instead of a language.

## 0.115.0

- Revert the previous changes.

## 0.114.0

- Change backslash syntax to work only with non-alphanumeric ASCII characters and whitespace.

## 0.113.0

- Refine label syntax.

## 0.112.1

- Enhance codeblock parser to infer languages from file extensions.

## 0.112.0

- Fix bracket syntax to exclude angle bracket.

## 0.111.3

- Fix link syntax to disallow nested link syntax.

## 0.111.2

- Leave media source URLs.

## 0.111.1

- Increase the maximum number of contained lines of some syntax from 99 to 100.

## 0.111.0

- Refine olist syntax.

## 0.110.0

- Refine olist syntax.

## 0.109.0

- Remove emoji syntax.

## 0.108.5

- Fix template parser.

## 0.108.4

- Fix distribution.

## 0.108.3

- Fix bundle processing.

## 0.108.2

- Fix hashtag syntax to disallow to be started after any characters except non-alphanumeric ASCII characters.

## 0.108.1

- Micro refactoring.

## 0.108.0

- Fix figure parser to take blockquote syntax correctly.

## 0.107.0

- Enhance annotation parser to trim linebreaks.

## 0.106.0

- Allow address syntax to use URL.
- Extend quote syntax to enable to be used at the first lines of paragraphs.

## 0.105.0

- Replace reference syntax with address syntax and quote syntax.

## 0.104.0

- Allow reference syntax to use all ASCII characters.

## 0.103.4

- Micro refactoring.

## 0.103.3

- Micro refactoring.

## 0.103.2

- Micro refactoring.

## 0.103.1

- Fix hashtag parser to disallow multibyte whitespace.

## 0.103.0

- Fix hashtag syntax to remove `#{tag}` syntax for consistency with autolinking.
- Fix channel parser.

## 0.102.0

- Add emoji syntax.

## 0.101.0

- Add template syntax.

## 0.100.0

- Improve ulist, olist, and ilist parsers not to match flag symbols with no trailing whitespace at first.
- Improve ulist and olist parsers to give parse failure messages.

## 0.99.6

- Fix figure function by removing optimization.

## 0.99.5

- Fix lightweight figure syntax to be possible to take graph syntax.

## 0.99.4

- Fix figure syntax to limit the maximum number of contained lines to 300.

## 0.99.3

- Fix example syntax to limit the maximum number of contained lines to 99.
- Fix graph syntax to limit the maximum number of contained lines to 99.

## 0.99.2

- Fix figure syntax to disallow to set a caption with formula number.

## 0.99.1

- Change insertion and deletion parsers to work flatly.

## 0.99.0

- Change insertion and deletion parsers to work recursively.

## 0.98.0

- Change codeblock syntax to limit the maximum number of contained lines to 300.
- Change mathblock syntax to limit the maximum number of contained lines to 99.
- Change extension syntax to require its own name.

## 0.97.0

- Add insertion syntax.
- Add deletion syntax.
- Add data syntax.
- Improve parse failure messages.
- Remove `ins` HTML tag.
- Remove `del` HTML tag.

## 0.96.1

- Remove trailing whitespace.

## 0.96.0

- Remove trailing whitespace.

## 0.95.0

- Extend link syntax to be possible to omit content part.
- Extend media syntax to be possible to omit alt text part.
- Improve media parser to make a link.
- Refine autolink parser.
- Improve codeblock parser to parse its text with autolink parser.

## 0.94.7

- Micro refactoring.

## 0.94.6

- Micro refactoring.

## 0.94.5

- Fix uri escaping.

## 0.94.4

- Fix autolink parser to exclude media.

## 0.94.3

- Fix uri parser to disallow backquote.

## 0.94.2

- Fix uri parser behavior with backslash.
- Fix uri parser to allow single quote and backquote.

## 0.94.1

- Fix ruby syntax to allow trailing whitespace.
- Fix ruby syntax to disallow unused ruby text.

## 0.94.0

- Refine hashtag syntax.
- Change channel syntax from inblock-level to inline-level syntax.
- Change hashtag syntax from inblock-level to inline-level syntax.

## 0.93.2

- Update Gist renderer.

## 0.93.1

- Fix breaklines function.
- Change breaklines function to ignore linebreaks in annotation syntax.

## 0.93.0

- Remove traditional comment syntax.
- Disallow empty comment.

## 0.92.2

- Add license notice.

## 0.92.1

- Mark invalid HTML as invalid.

## 0.92.0

- Don't format indexes.

## 0.91.0

- Remove tag level of hashtag syntax.

## 0.90.3

- Fix account parser.
- Fix email parser.

## 0.90.2

- Fix hashtag parser.

## 0.90.1

- Allow leading `@` in square brackets.

## 0.90.0

- Refine link, media, and ruby syntax.
- Disallow link and media syntax having no URL.
- Change annotation and authority syntax from inblock-level syntax to inline-level syntax.

## 0.89.0

- Add graph syntax.

## 0.88.4

- Micro refactoring.

## 0.88.3

- Micro refactoring.

## 0.88.2

- Enable HTML entity syntax with ruby part of ruby syntax.

## 0.88.1

- Fix ruby parser.

## 0.88.0

- Add ruby syntax.
- Remove `ruby`, `rt`, and `rp` HTML tags.
- Disallow linebreaks in authority syntax.

## 0.87.1

- Optimization.

## 0.87.0

- Add breaklines function.
- Disallow trailing backslash of end of line with hashtag syntax.

## 0.86.0

- Parse blockquote text with autolink parser.

## 0.85.5

- Fix bind function to throw an exception when another process starts before finishing the current process.

## 0.85.4

- Leave comment data.

## 0.85.3

- Avoid a bug of twitter widget.

## 0.85.2

- Fix rendering of slideshare.

## 0.85.1

- Allow leading whitespace in math syntax.

## 0.85.0

- Enable figure parser to set the base index number.
- Increment the base index number for each h2 elements.
- Keep figure index depth.
- Fix figure index increment order.

## 0.84.0

- Improve blockquote parser.

## 0.83.0

- Refine math syntax.

## 0.82.0

- Add email syntax.
- Extend uri syntax.
- Extend account syntax.
- Move account syntax into inline-level syntax.

## 0.81.3

- Improve blockquote parser.

## 0.81.2

- Improve blockquote parser.

## 0.81.1

- Separate auto numbering context per blockquote elements.

## 0.81.0

- Refine figure parser.
- Support formula number rendering.
- Fix extension parser.
- Fix figure function.

## 0.80.3

- Fix code parser.

## 0.80.2

- Fix code parser.
- Fix codeblock parser.
- Fix mathblock parser.
- Fix extension parser.

## 0.80.1

- Allow whitespace in code syntax.

## 0.80.0

- Disallow to use formula number except math syntax in figure syntax.

## 0.79.6

- Fix annotation and authority parser.

## 0.79.5

- Fix annotation and authority parser.

## 0.79.4

- Mark the missing of required attributes with link, media, and HTML syntax.

## 0.79.3

- Allow tailing whitespace in HTML tag of HTML syntax.

## 0.79.2

- Change annotation mark.

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

- Fix link, media, and URL parser.
  - Don't escape any character by `\`.

## 0.64.0

- Remove control characters.
- Fix link text constraints.

## 0.63.1

- Disallow link texts starting with `@`.

## 0.63.0

- Parse as extension before parsing as link.
- Disallow link texts starting with `#`.

## 0.62.0

- Allow invalid HTML tags with replacing.
- Don't translate the text of code and math.

## 0.61.0

- Allow tel protocol in link syntax.
- Refine rendering options.

## 0.60.0

- Disallow ulist syntax without `-`.

## 0.59.0

- Disallow figure names starting with numbers.
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
- Improve URL parser.
  - Allow escaped whitespace.
- Improve account parser.
  - Don't escape URI after `@` symbol.
  - Use anchor element.

## 0.39.1

- Fix URL parser.
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

- Fix URL parser.

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

- Fix URL processing.

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
