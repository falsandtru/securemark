import { HeadingParser } from '../block';
import { verify } from './util/verification';
import { combine, loop } from '../../combinator';
import { index, defineIndex } from './util/index';
import { inline } from '../inline';
import { squash } from '../squash';

const syntax = /^(#{1,6})[^\S\n]+?([^\n]+)/;

export const heading: HeadingParser = verify((source: string) => {
  if (!source.startsWith('#')) return;
  const [whole = '', { length: level } = '', title = ''] = source.split('\n', 1)[0].match(syntax) || [];
  if (!whole) return;
  assert(level > 0 && level < 7);
  assert(title.length > 0);
  const [children = [], rest = undefined] = loop(combine<HTMLElement | Text, HeadingParser.InnerParsers>([index, inline]))(title.trim()) || [];
  if (rest === undefined) return;
  const el = document.createElement(`h${level}` as 'h1');
  void el.appendChild(squash(children));
  void defineIndex(el);
  return [[el], source.slice(whole.length + 1)];
});
