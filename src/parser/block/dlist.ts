import { Result } from '../../parser';
import { DListParser, consumeBlockEndEmptyLine } from '../block';
import { compose } from '../../combinator/compose';
import { loop } from '../../combinator/loop';
import { InlineParser, inline } from '../inline';
import { squash } from '../inline/text';

type SubParsers = [InlineParser];

const syntax = /^~\s/;
const separator = /^[~:](?:\s|$)/;

export const dlist: DListParser = function (source: string): Result<HTMLDListElement, SubParsers> {
  const [whole] = source.match(syntax) || [''];
  if (!whole) return;
  const el = document.createElement('dl');
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '' || !line.match(separator)) break;
    switch (line[0]) {
      case '~': {
        const dt = el.appendChild(document.createElement('dt'));
        void dt.appendChild(squash((loop(compose<SubParsers, HTMLElement | Text>([inline]))(line.slice(1).trim()) || [[]])[0]));
        source = source.slice(line.length + 1);
        continue;
      }
      case ':': {
        if (!el.lastChild) return;
        const dd = el.appendChild(document.createElement('dd'));
        const texts: string[] = [line.slice(1).trim()];
        source = source.slice(line.length + 1);
        while (true) {
          const line = source.split('\n', 1)[0];
          if (line.trim() === '' || line.match(separator)) break;
          void texts.push(line);
          source = source.slice(line.length + 1);
        }
        void dd.appendChild(squash((loop(compose<SubParsers, HTMLElement | Text>([inline]))(texts.join('\n').trim()) || [[]])[0]));
        continue;
      }
      default: {
        return;
      }
    }
  }
  return el.children.length === 0 || el.lastElementChild!.tagName.toLowerCase() !== 'dd'
    ? void 0
    : consumeBlockEndEmptyLine<HTMLDListElement, SubParsers>([el], source);
}
