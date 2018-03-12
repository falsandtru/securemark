import { AutolinkParser } from '../../inline';
import { combine, some, surround } from '../../../combinator';
import { escsource } from '../../source/escapable';
import { parenthesis } from '../../source/parenthesis';
import { link } from '../link';

const syntax = /^(?:!?h)?ttps?:\/\/\S/;
export const closer = /^['"`|\[\](){}<>]|^[-+*~^,.;:!?]*(?=[\s|\[\](){}<>]|$)|^\\?(?:\n|$)/;
const escape = /^(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?:\/\/\S/;

export const url: AutolinkParser.UrlParser = source => {
  if (source.search(escape) === 0) return [[document.createTextNode(source.slice(0, source.indexOf(':')))], source.slice(source.indexOf(':'))];
  if (source.search(syntax) !== 0) return;
  const flag = source.startsWith('!h');
  source = flag
    ? source.slice(1)
    : source;
  const [, rest = undefined] = some(combine<AutolinkParser.UrlParser>([surround('[', ipv6, ']'), parenthesis, some(escsource, closer)]))(source) || [];
  if (rest === undefined) return;
  const attribute = source.startsWith('ttp')
    ? ' nofollow'
    : '';
  const url = `${source.startsWith('ttp') ? 'h' : ''}${source.slice(0, source.length - rest.length)}`
    .replace(/\\.?/g, str => str.length < 2 ? '' : str)
    .replace(/\s/g, encodeURI);
  return !flag
    ? link(`[](${url}${attribute})${rest}`)
    : link(`[![](${url})](${url})${rest}`) as any;
};

const addr = /^[:0-9a-z]+/i;
const ipv6: AutolinkParser.UrlParser.IPV6Parser = source => {
  const [whole = ''] = source.match(addr) || [];
  if (!whole) return;
  return [[document.createTextNode(whole)], source.slice(whole.length)];
};
