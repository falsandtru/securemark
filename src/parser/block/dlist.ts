import { Result } from '../../parser';
import { DListParser, consumeBlockEndEmptyLine } from '../block';
import { combine } from '../../combinator/combine';
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
    if (line.trim() === '') break;
    switch (line.slice(0, 2).trim()) {
      case '~': {
        const dt = el.appendChild(document.createElement('dt'));
        void dt.appendChild(squash((loop(combine<SubParsers, HTMLElement | Text>([inline]))(line.slice(1).trim()) || [[]])[0]));
        source = source.slice(line.length + 1);
        continue;
      }
      default: {
        assert(el.lastElementChild);
        const dd = line.slice(0, 2).trim() === ':' || el.lastElementChild!.tagName.toLowerCase() !== 'dd'
          ? el.appendChild(document.createElement('dd'))
          : el.lastElementChild!;
        const texts = [line.slice(line.slice(0, 2).trim() === ':' ? 1 : 0)];
        source = source.slice(line.length + 1);
        while (true) {
          const line = source.split('\n', 1)[0];
          if (line.trim() === '' || line.match(separator)) break;
          void texts.push(line);
          source = source.slice(line.length + 1);
        }
        void dd.appendChild(squash((loop(combine<SubParsers, HTMLElement | Text>([inline]))(texts.join('\n').trim()) || [[]])[0]));
        continue;
      }
    }
  }
  assert(el.firstElementChild!.tagName.toLowerCase() === 'dt');
  if (el.lastElementChild && el.lastElementChild!.tagName.toLowerCase() === 'dt') {
    void el.appendChild(document.createElement('dd'));
  }
  return el.children.length === 0
    ? void 0
    : consumeBlockEndEmptyLine<HTMLDListElement, SubParsers>([el], source);
};
