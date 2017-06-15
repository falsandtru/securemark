import { Result } from '../../combinator/parser';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { DeletionParser, InlineParser, inline } from '../inline';
import { squash } from '../text';

type SubParsers = [InlineParser];

const syntax = /^~~[\s\S]+?~~/;
const closer = /^~~/;

export const deletion: DeletionParser = function (source: string): Result<HTMLElement, SubParsers> {
  if (!source.startsWith('~~') || source.search(syntax) !== 0) return;
  const [cs, rest] = loop(combine<SubParsers, HTMLElement | Text>([inline]), closer)(source.slice(2)) || [[], ''];
  if (!rest.startsWith('~~')) return;
  const el = document.createElement('del');
  void el.appendChild(squash(cs));
  if (el.textContent!.trim() === '') return;
  return [[el], rest.slice(2)];
};
