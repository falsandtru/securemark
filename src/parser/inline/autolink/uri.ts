import { Result } from '../../../combinator/parser';
import { combine } from '../../../combinator/combine';
import { loop } from '../../../combinator/loop';
import { AutolinkParser, InlineParser } from '../../inline';
import { TextParser, squash } from '../../text';
import { text } from '../../text/text';
import { link } from '../link';

const syntax = /^(?:!?h)?ttps?:\/\/\S+/;
const closer = /^['"`[\](){}<>]|^\\?(?:\s|$)|^[~^+*,.;:!?]*(?:[\s\])}<>|]|$)/;
const escape = /^(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?:\/\/\S+/;

export const uri: AutolinkParser.UriParser = function (source: string): Result<HTMLAnchorElement | Text, [InlineParser]> {
  if (source.search(escape) === 0) return [[document.createTextNode(source.slice(0, source.indexOf(':')))], source.slice(source.indexOf(':'))];
  if (source.search(syntax) !== 0) return;
  const media = source.startsWith('!h');
  source = media
    ? source.slice(1)
    : source;
  const [cs, rest] = loop(combine<[TextParser], HTMLElement | Text>([text]), closer)(source) || [[], ''];
  assert(!squash(cs).querySelector('*'));
  return media
    ? link(`[![](${source.slice(0, source.length - rest.length)})](${source.slice(0, source.length - rest.length)})${rest}`)
    : link(`[](${source.startsWith('h') ? '' : 'h'}${source.slice(0, source.length - rest.length)}${source.startsWith('h') ? '' : ' nofollow'})${rest}`);
};
