import { ExtensionParser } from '../../block';
import { block, validate, fence, clear, fmap } from '../../../combinator';
import { invalid } from '../../util';
import { html } from 'typed-dom/dom';

const opener = /^(~{3,})(?!~)[^\n]*(?:$|\n)/;

export const segment: ExtensionParser.PlaceholderParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 300))));

export const segment_: ExtensionParser.PlaceholderParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 300, false))), false);

export const placeholder: ExtensionParser.PlaceholderParser = block(validate('~~~', fmap(
  fence(opener, Infinity),
  ([body, overflow, closer, opener, delim]) => [
    html('pre', {
      class: 'invalid',
      translate: 'no',
      ...invalid(
        'extension',
        'fence',
        !closer ? `Missing the closing delimiter "${delim}"` :
          overflow ? `Invalid trailing line after the closing delimiter "${delim}"` :
            'Invalid argument'),
    }, `${opener}${body}${overflow || closer}`),
  ])));
