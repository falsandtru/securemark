import { Result } from '../../parser';
import { ExtensionParser, consumeBlockEndEmptyLine } from '../block';
import { compose } from '../../combinator/compose';
import { placeholder } from './extension/placeholder';

type SubParsers = [ExtensionParser.PlaceholderParser];

const syntax = /^(~{3,})[ \t]*\n((?:[^\n]*\n)*)\1/;
const cache = new Map<string, RegExp>();

export const extension: ExtensionParser = function (source: string): Result<HTMLElement, SubParsers> {
  const [whole, keyword, text] = source.match(syntax) || ['', '', ''];
  if (!whole) return;
  if (!cache.has(keyword)) {
    void cache.set(keyword, new RegExp(`^${keyword}\s*(?:\n|$)`));
  }
  const [ns, rest] = compose<SubParsers, HTMLElement>([placeholder])(text) || [[], ''];
  return source.length === rest.length
    ? void 0
    : consumeBlockEndEmptyLine<HTMLElement, SubParsers>(ns, source.slice(whole.length));
}
