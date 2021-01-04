import { ExtensionParser } from '../../block';
import { block, validate, fence, clear, fmap } from '../../../combinator';
import { html } from 'typed-dom';

const opener = /^(~{3,})(?!~)[^\n]*(?:$|\n)/;

export const segment: ExtensionParser.PlaceholderParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 300))));

export const placeholder: ExtensionParser.PlaceholderParser = block(validate('~~~', fmap(
  fence(opener, 300),
  ([body, closer, opener, delim]) => [
    html('pre', {
      class: 'notranslate invalid',
      'data-invalid-syntax': 'extension',
      'data-invalid-type': closer ? 'syntax' : 'closer',
      'data-invalid-description': closer ? 'Invalid syntax.' : `Missing the closing delimiter ${delim}.`,
    }, `${opener}${body}${closer}`)
  ])));
