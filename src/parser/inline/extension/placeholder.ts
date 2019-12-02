import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, verify, surround, lazy, fmap, eval } from '../../../combinator';
import { defrag, trimTextEnd, hasTightContent } from '../../util';
import { html } from 'typed-dom';

// Already used symbols: !@$&*<
export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => subline(fmap(
  surround(
    /^\[[:^]/,
    verify(trimTextEnd(defrag(some(union([inline]), /^\\?\n|^]/))), ns => hasTightContent(html('div', ns))),
    ']'),
  () =>
    [html('span', { class: 'invalid', 'data-invalid-syntax': 'extension', 'data-invalid-type': 'syntax' }, eval(some(inline)(`Invalid syntax: Extension: Invalid flag.`, {}, {})))])));
