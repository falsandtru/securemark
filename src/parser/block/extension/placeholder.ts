import { ExtensionParser } from '../../block';
import { block, validate, fence, clear, fmap } from '../../../combinator';
import { html } from 'typed-dom/dom';

const opener = /^(~{3,})(?!~)[^\n]*(?:$|\n)/;

export const segment: ExtensionParser.PlaceholderParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 300))));

export const segment_: ExtensionParser.PlaceholderParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 300, false))), false);

export const placeholder: ExtensionParser.PlaceholderParser = block(validate('~~~', fmap(
  fence(opener, Infinity),
  ([body, closer, opener, delim]) => [
    html('pre', {
      class: 'invalid',
      translate: 'no',
      'data-invalid-syntax': 'extension',
      'data-invalid-type': !closer ? 'fence' : 'syntax',
      'data-invalid-message': !closer ? `Missing the closing delimiter "${delim}"` : 'Invalid syntax',
    }, `${opener}${body}${closer}`)
  ])));
