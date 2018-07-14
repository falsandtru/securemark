import { ExtensionParser } from '../../inline';
import { union, match, surround, verify, fmap, build } from '../../../combinator';
import { line } from '../../source/line';
import '../../source/unescapable';
import { link } from '../link';
import { hasTightText } from '../../util';

export const label: ExtensionParser.LabelParser = line(verify(fmap(build(() =>
  surround(
    '[:',
    match(
      /^(?:\$|[a-z]+)(?:(?:-[a-z][0-9a-z]*)+(?:-0(?:\.0)*)?|-[0-9]+(?:\.[0-9]+)*)/,
      ([query], rest) =>
        union<ExtensionParser.LabelParser>([link])
          (`[\\${query}](#${makeLabel(query)})${rest}`)),
    ']')),
  ([el]) => {
    void el.setAttribute('class', el.getAttribute('href')!.slice(1));
    return [el];
  }
), ([el]) => hasTightText(el)), false);

function makeLabel(text: string): string {
  assert(!text.includes('\n'));
  return `label:${text}`;
}
