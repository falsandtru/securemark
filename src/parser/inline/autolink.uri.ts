import { Result } from '../../parser';
import { AutolinkParser, TextParser, InlineParser, squash } from '../inline';
import { combine } from '../../combinator/combine';
import { loop } from '../../combinator/loop';
import { text } from './text';
import { link } from './link';

type SubParsers = [InlineParser];

const syntax = /^h?ttps?:\/\/\S+/;
const closer = /^['"`[\](){}<>]|^\\?(?:\s|$)|^[~^+*,.;:!?]*(?:[\s\])}<>|]|$)/;
const escape = /^(?:[0-9a-zA-Z]h|[0-9a-gi-zA-Z])ttps?:\/\/\S+/;

export const uri: AutolinkParser.UriParser = function (source: string): Result<HTMLAnchorElement | Text, SubParsers> {
  if (source.search(escape) === 0) return [[document.createTextNode(source.slice(0, 3))], source.slice(3)];
  if (source.search(syntax) !== 0) return;
  const [cs, rest] = loop(combine<[TextParser], HTMLElement | Text>([text]), closer)(source) || [[], ''];
  assert(!squash(cs).querySelector('*'));
  return link(`[](${source[0] === 't' ? 'h' : ''}${source.slice(0, source.length - rest.length)}${source[0] === 't' ? ' nofollow' : ''})${rest}`);
};
