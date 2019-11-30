import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, validate, surround, lazy, fmap, eval } from '../../../combinator';
import { defrag } from '../../util';
import { html } from 'typed-dom';

// Already used symbols: !@$&*<
export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => subline(fmap(
  surround(
    '[',
    validate(/^[:^](?!])/, defrag(some(union([inline]), /^\\?\n|^]/))),
    ']'),
  () =>
    [html('span', { class: 'invalid', 'data-invalid-syntax': 'extension', 'data-invalid-type': 'syntax' }, eval(some(inline)(`Invalid syntax: Extension: Invalid flag.`, {}, {})))])));
