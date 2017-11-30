import { ParagraphParser } from '../block';
import { verify } from './util/verification';
import { combine, loop } from '../../combinator';
import { inline } from '../inline';
import { squash } from '../squash';

const closer = /^[^\S\n]*\\?(?=\n[^\S\n]*\\?\n|\n?$)/;

export const paragraph: ParagraphParser = verify((source: string): [[HTMLParagraphElement], string] | undefined => {
  if (source.startsWith('\n')) return;
  source = source.replace(/^\s+/, '');
  const el = document.createElement('p');
  const [cs, rest] = loop(combine<HTMLElement | Text, ParagraphParser.InnerParsers>([inline]), closer)(source) || [[document.createTextNode(source)], ''];
  void el.appendChild(squash(cs));
  return [[el], rest.slice(rest.split('\n').shift()!.length + 1)];
});
