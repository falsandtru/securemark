import { MarkdownParser } from '../../markdown';
import { block, validate, fmap, fence } from '../combinator';
import { html } from 'typed-dom';

export const header: MarkdownParser.HeaderParser = block(validate('---', fmap(
  fence(/^(---)[^\S\n]*(?:$|\n)/, 100, true),
  // Bug: Type mismatch between outer and inner.
  ([body, closer, opener, delim]: string[]) =>
    closer && body.search(/^(?![A-Za-z]|$)/m) === -1
      // TODO: Set the specified base URL.
      ? [html('div', { class: 'header' }, body.slice(0, -1))]
      : [html('pre', {
          class: `header notranslate invalid`,
          'data-invalid-syntax': 'header',
          'data-invalid-type': 'closer',
          'data-invalid-message': closer ? `All lines must start with alphabet characters` : `Missing closing delimiter ${delim}`,
        }, `${opener}${body}${closer}`)])));
