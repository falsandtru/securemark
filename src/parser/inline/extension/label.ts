import { ExtensionParser } from '../../inline';
import { union, match, surround, transform, build } from '../../../combinator';
import { line } from '../../source/line';
import { link } from '../link';

const syntax = /^[a-z]+(?:(?:-[a-z][0-9a-z]*|-[0-9]+[a-z][0-9a-z]*)+(?:-0(?:\.0)*)?|-[0-9]+(?:\.[0-9]+)*)/;

export const label: ExtensionParser.LabelParser = line(transform(build(() =>
  surround(
    '[:',
    match(syntax, ([query], source) =>
      union<ExtensionParser.LabelParser>([link])
        (`[${query}](#${makeLabel(query)})${source.slice(query.length)}`)),
    ']')),
  ([el], rest) => {
    void el.setAttribute('class', el.getAttribute('href')!.slice(1));
    return [[el], rest];
  }
), false);

function makeLabel(text: string): string {
  assert(!text.includes('\n'));
  return `label:${text}`;
}
