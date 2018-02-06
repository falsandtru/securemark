import { HeadingParser } from '../block';
import { verify } from './util/verification';
import { SubParsers, combine, loop } from '../../combinator';
import { index, defineIndex } from './util/index';
import { inline } from '../inline';
import { html } from 'typed-dom';

const syntax = /^(#{1,6})[^\S\n]+?([^\n]+)/;

export const heading: HeadingParser = verify(source => {
  if (!source.startsWith('#')) return;
  const [whole = '', { length: level } = '', title = ''] = source.split('\n', 1)[0].match(syntax) || [];
  if (!whole) return;
  assert(level > 0 && level < 7);
  assert(title.length > 0);
  const [children = [], rest = undefined] = loop(combine<SubParsers<HeadingParser>>([index, inline]))(title.trim()) || [];
  if (rest === undefined) return;
  const el = html(`h${level}` as 'h1', children);
  void defineIndex(el);
  return [[el], source.slice(whole.length + 1)];
});
