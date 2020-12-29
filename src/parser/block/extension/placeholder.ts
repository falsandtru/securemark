import { ExtensionParser } from '../../block';
import { block, validate, fence, clear, fmap } from '../../../combinator';
import { html } from 'typed-dom';

const opener = /^(~{3,})(?!~)[^\n]*(?:$|\n)/;

export const segment: ExtensionParser.PlaceholderParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 300))));

export const placeholder: ExtensionParser.PlaceholderParser = block(validate('~~~', fmap(
  fence(opener, 300),
  ([body, closer, opener]) =>
    [html('pre', { class: 'notranslate invalid', 'data-invalid-syntax': 'extension', 'data-invalid-type': 'syntax', 'data-invalid-description': 'Invalid syntax.' }, `${opener}${body}${closer}`)])));
