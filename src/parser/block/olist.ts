import { Result } from '../../parser';
import { UListParser, OListParser, consumeBlockEndEmptyLine } from '../block';
import { compose } from '../../combinator/compose';
import { loop } from '../../combinator/loop';
import { ulist } from './ulist';
import { indent } from './indent';
import { InlineParser, inline } from '../inline';
import { squash } from '../inline/text';

type SubParsers = [InlineParser] | [UListParser, OListParser];

const syntax = /^([0-9]+)\./;

export const olist: OListParser = function (source: string): Result<HTMLOListElement, SubParsers> {
  const [whole, index] = source.match(syntax) || ['', ''];
  if (!whole) return;
  const el = document.createElement('ol');
  void el.setAttribute('start', +index > 0 ? index : '1');
  while (true) {
    const line = source.split('\n', 1)[0];
    switch (line[0]) {
      case (source.match(syntax) || ['', ''])[1][0] || '': {
        const text = line.slice(line.indexOf('.') + 1);
        if (text.length > 0 && text[0].trim() !== '') return;
        const li = document.createElement('li');
        if (text.trim() !== '') {
          void li.appendChild(squash((loop(compose<SubParsers, HTMLElement | Text>([inline]))(text.trim()) || [[]])[0]));
        }
        void el.appendChild(li);
        source = source.slice(line.length + 1);
        continue;
      }
      case ' ':
      case '\t': {
        if (line.trim() === '') break;
        if (el.lastElementChild!.lastElementChild && ['ul', 'ol'].indexOf(el.lastElementChild!.lastElementChild!.tagName.toLowerCase()) !== -1) return;
        const [block, rest] = indent(source);
        if (rest === source) return;
        const [children, brest] = compose<SubParsers, HTMLElement | Text>([ulist, olist])(block) || [[], ''];
        if (children.length === 0 || brest) return;
        void el.lastElementChild!.appendChild(squash(children));
        source = rest;
        continue;
      }
    }
    break;
  }
  return el.children.length === 0
    ? void 0
    : consumeBlockEndEmptyLine<HTMLOListElement, SubParsers>([el], source);
}
