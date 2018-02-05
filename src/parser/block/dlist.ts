import { DListParser } from '../block';
import { verify } from './util/verification';
import { combine, loop } from '../../combinator';
import { index, defineIndex } from './util/index';
import { InlineParser, inline } from '../inline';
import { squash } from '../squash';

const syntax = /^~\s/;
const separator = /^[~:](?:\s|$)/;

export const dlist: DListParser = verify(source => {
  const [whole = ''] = source.match(syntax) || [];
  if (!whole) return;
  const el = document.createElement('dl');
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '') break;
    switch (line.slice(0, 2).trim()) {
      case '~': {
        const dt = el.appendChild(document.createElement('dt'));
        void dt.appendChild(squash((loop(combine<HTMLElement | Text, DListParser.InnerParsers>([index, inline]))(line.slice(1).trim()) || [[]])[0]));
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
        void dd.appendChild(squash((loop(combine<HTMLElement | Text, [InlineParser]>([inline]))(texts.join('\n').trim()) || [[]])[0]));
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
