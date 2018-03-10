import { DListParser } from '../block';
import { combine, some } from '../../combinator';
import { verify } from './util/verification';
import { block } from '../source/block';
import { indexer, defineIndex } from './util/indexer';
import { InlineParser, inline } from '../inline';
import { squash } from '../squash';
import { html } from 'typed-dom';

const syntax = /^~\s/;
const separator = /^[~:](?:\s|$)/;

export const dlist: DListParser = verify(block(source => {
  const [whole = ''] = source.match(syntax) || [];
  if (!whole) return;
  const el = html('dl');
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '') break;
    switch (line.slice(0, 2).trim()) {
      case '~': {
        const dt = el.appendChild(html('dt'));
        void dt.appendChild(squash((some(combine<DListParser>([indexer, inline]))(line.slice(1).trim()) || [[]])[0], document.createDocumentFragment()));
        void defineIndex(dt);
        source = source.slice(line.length + 1);
        continue;
      }
      default: {
        assert(el.lastElementChild);
        const dd = line.slice(0, 2).trim() === ':' || el.lastElementChild!.tagName.toLowerCase() !== 'dd'
          ? el.appendChild(html('dd'))
          : el.lastElementChild!;
        const texts = [line.slice(line.slice(0, 2).trim() === ':' ? 1 : 0)];
        source = source.slice(line.length + 1);
        while (true) {
          const line = source.split('\n', 1)[0];
          if (line.trim() === '' || line.search(separator) === 0) break;
          void texts.push(line);
          source = source.slice(line.length + 1);
        }
        void dd.appendChild(squash((some(combine<[InlineParser]>([inline]))(texts.join('\n').trim()) || [[]])[0], document.createDocumentFragment()));
        continue;
      }
    }
  }
  assert(el.firstElementChild!.tagName.toLowerCase() === 'dt');
  if (el.lastElementChild && el.lastElementChild!.tagName.toLowerCase() === 'dt') {
    void el.appendChild(html('dd'));
  }
  assert(el.children.length > 0);
  return [[el], source];
}));
