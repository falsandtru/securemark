import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { DListParser, IndexerParser } from '../block';
import { verifyBlockEnd } from './end';
import { indexer, defineIndex } from './indexer';
import { InlineParser, inline } from '../inline';
import { squash } from '../text';

type SubParsers = [IndexerParser, InlineParser];

const syntax = /^~\s/;
const separator = /^[~:](?:\s|$)/;

export const dlist: DListParser = verifyBlockEnd(function (source: string): Result<HTMLDListElement, SubParsers> {
  const [whole] = source.match(syntax) || [''];
  if (!whole) return;
  const el = document.createElement('dl');
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '') break;
    switch (line.slice(0, 2).trim()) {
      case '~': {
        const dt = el.appendChild(document.createElement('dt'));
        void dt.appendChild(squash((loop(combine<SubParsers, HTMLElement | Text>([indexer, inline]))(line.slice(1).trim()) || [[]])[0]));
        void defineIndex(dt);
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
          if (line.trim() === '' || line.search(separator) === 0) break;
          void texts.push(line);
          source = source.slice(line.length + 1);
        }
        void dd.appendChild(squash((loop(combine<[InlineParser], HTMLElement | Text>([inline]))(texts.join('\n').trim()) || [[]])[0]));
        continue;
      }
    }
  }
  assert(el.firstElementChild!.tagName.toLowerCase() === 'dt');
  if (el.lastElementChild && el.lastElementChild!.tagName.toLowerCase() === 'dt') {
    void el.appendChild(document.createElement('dd'));
  }
  assert(el.children.length > 0);
  return [[el], source];
});
