import { ExtensionParser, inline } from '../../inline';
import { union, some, subline, verify, surround, lazy, fmap } from '../../../combinator';
import { defrag, trimNodeEnd, isTightVisible } from '../../util';
import { html } from 'typed-dom';

// Already used symbols: !@$&*<
export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => subline(fmap(
  surround(
    /^\[[:^]/,
    verify(trimNodeEnd(defrag(some(union([inline]), /^\\?\n|^]/))), ns => isTightVisible(html('div', ns))),
    ']'),
  ns =>
    [html('span', { class: 'invalid', 'data-invalid-syntax': 'extension', 'data-invalid-message': 'Invalid flag' }, ns)])));
