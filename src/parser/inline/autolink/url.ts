import { Result } from '../../../combinator/parser';
import { combine } from '../../../combinator/combine';
import { loop } from '../../../combinator/loop';
import { AutolinkParser, InlineParser } from '../../inline';
import { TextParser, squash } from '../../text';
import { text } from '../../text/text';
import { link } from '../link';
import { media, mediatype } from '../media';

const syntax = /^(?:!?h)?ttps?:\/\/\S|^#\S/;
const closer = /^['"`[\](){}<>]|^\\?(?:\s|$)|^[~^+*,.;:!?]*(?:[\s\])}<>|]|$)/;
const escape = /^(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?:\/\/\S|^[0-9a-zA-Z][!?]*#\S/;

export const url: AutolinkParser.UrlParser = function (source: string): Result<HTMLAnchorElement | HTMLImageElement | Text, [InlineParser | TextParser]> {
  if (source.search(escape) === 0) return [[document.createTextNode(source.slice(0, source.search(/[:#]/)))], source.slice(source.indexOf(':'))];
  if (source.search(syntax) !== 0) return;
  const flag = source.startsWith('!h');
  source = flag
    ? source.slice(1)
    : source;
  const [cs, rest] = loop(combine<[TextParser], HTMLElement | Text>([text]), closer)(source) || [[], ''];
  assert(!squash(cs).querySelector('*'));
  const attribute = source.startsWith('#')
    ? ' index'
    : source.startsWith('ttp')
      ? ' nofollow'
      : '';
  const uri = `${source.startsWith('ttp') ? 'h' : ''}${source.slice(0, source.length - rest.length)}`;
  return !flag
    ? link(`[](${uri}${attribute})${rest}`)
    : mediatype(uri) === 'image'
      ? link(`[![](${uri})](${uri})${rest}`)
      : media(`![](${uri})${rest}`);
};
