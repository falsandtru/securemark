import { HeadingParser } from '../block';
import { verify } from './util/verification';
import { combine, loop } from '../../combinator';
import { index, defineIndex } from './util/index';
import { inline } from '../inline';
import { squash } from '../squash';

const syntax = /^(#{1,6})[^\S\n]+?([^\n]+)/;

export const heading: HeadingParser = verify((source: string): [[HTMLHeadingElement], string] | undefined => {
  if (!source.startsWith('#')) return;
  const [whole = '', { length: level } = '', title = ''] = source.split('\n', 1)[0].match(syntax) || [];
  if (!whole) return;
  assert(level > 0 && level < 7);
  assert(title.length > 0);
  const [children = [], rest = undefined] = loop(combine<HTMLElement | Text, HeadingParser.InnerParsers>([index, inline]))(title.trim()) || [];
  if (rest === undefined) return;
  const el = document.createElement(<'h1'>`h${level}`);
  void el.appendChild(squash(children));
  void defineIndex(el);
  return [[el], source.slice(whole.length + 1)];
});
