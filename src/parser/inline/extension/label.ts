import { ExtensionParser } from '../../inline';
import { union, match, surround, fmap, build } from '../../../combinator';
import { line } from '../../source/line';
import '../../source/unescapable';
import { link } from '../link';

export const label: ExtensionParser.LabelParser = line(fmap(build(() =>
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
), false);

function makeLabel(text: string): string {
  assert(!text.includes('\n'));
  return `label:${text}`;
}
