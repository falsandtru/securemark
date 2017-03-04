import { Result } from '../../parser';
import { UListParser, OListParser, consumeBlockEndEmptyLine } from '../block';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { olist } from './olist';
import { indent } from './indent';
import { InlineParser, inline, squash } from '../inline';

type SubParsers = [InlineParser] | [UListParser, OListParser];

const syntax = /^-(?:\s|$)/;

export const ulist: UListParser = function (source: string): Result<HTMLUListElement, SubParsers> {
  const [whole] = source.match(syntax) || ['', ''];
  if (!whole) return;
  const el = document.createElement('ul');
  while (true) {
    const line = source.split('\n', 1)[0];
    if (line.trim() === '') break;
    if (line.match(syntax)) {
      const text = line.slice(1).trim();
      const li = el.appendChild(document.createElement('li'));
      void li.appendChild(squash((loop(combine<SubParsers, HTMLElement | Text>([inline]))(text) || [[]])[0]));
      source = source.slice(line.length + 1);
      continue;
    }
    else {
      if (el.lastElementChild!.lastElementChild && ['ul', 'ol'].indexOf(el.lastElementChild!.lastElementChild!.tagName.toLowerCase()) !== -1) return;
      const [block, rest] = indent(source);
      if (rest === source) return;
      const [children, brest] = combine<SubParsers, HTMLElement | Text>([ulist, olist])(block) || [[], block];
      if (children.length === 0 || brest.length !== 0) return;
      void el.lastElementChild!.appendChild(squash(children));
      source = rest;
      continue;
    }
  }
  return el.children.length === 0
    ? void 0
    : consumeBlockEndEmptyLine<HTMLUListElement, SubParsers>([el], source);
};
