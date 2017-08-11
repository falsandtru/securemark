import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { IndexParser } from '../inline';
import { TextParser, squash } from '../text';
import { link } from './link';
import { text } from '../text/text';
import { makeIndex } from '../text/index';

type SubParsers = [TextParser];

const syntax = /^\[#\S[^\n]*?\]/;

export const index: IndexParser = function (source: string): Result<HTMLAnchorElement, SubParsers> {
  if (!source.startsWith('[#') || source.search(syntax) !== 0) return;
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([text]), /^[\]\n]/)(`${source.slice(2)}`) || [[], ''];
  if (!rest.startsWith(']')) return;
  const txt = squash(cs).textContent!;
  if (txt !== txt.trim()) return;
  const result = link(`[](#${makeIndex(txt)})${rest.slice(1)}`);
  if (!result) return;
  const [[el]] = result;
  el.textContent = txt;
  return result as Result<HTMLAnchorElement, SubParsers>;
};
