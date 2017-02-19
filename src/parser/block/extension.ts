import { Parser, Result } from '../../parser';
import { ExtensionParser, consumeBlockEndEmptyLine } from '../block';
import { compose } from '../../combinator/compose';
import { placeholder } from './extension/placeholder';

type SubParsers = Parser<HTMLElement, any>[];

const syntax = /^(~{3,})[ \t]*\n(?:[^\n]*\n)*\1/;

export const extension: ExtensionParser = function (source: string): Result<HTMLElement, SubParsers> {
  const [whole] = source.match(syntax) || [''];
  if (!whole) return;
  const [ns, rest] = compose<SubParsers, HTMLElement>([
    placeholder
  ])(source) || [[], source];
  return source.length === rest.length
    ? void 0
    : consumeBlockEndEmptyLine<HTMLElement, SubParsers>(ns, rest);
}
