import { ExtensionParser, inline } from '../../inline';
import { union, some, fmap, surround, validate, subline, lazy, eval } from '../../../combinator';
import { html } from 'typed-dom';

// Already used symbols: !@$&*<
export const placeholder: ExtensionParser.PlaceholderParser = subline(fmap(lazy(() =>
  surround(
    '[',
    validate(/^[~^](?!\])/, some(union([inline]), /^[\n\]]/)),
    ']')),
  () =>
    [html('span', { class: 'invalid', 'data-invalid-type': 'syntax' }, eval(some(inline)(`Invalid syntax: Extension: Invalid flag.`)))]));
