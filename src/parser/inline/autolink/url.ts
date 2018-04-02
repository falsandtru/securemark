import { AutolinkParser } from '../../inline';
import { union, some, match, surround, transform } from '../../../combinator';
import { line } from '../../source/line';
import { escsource } from '../../source/escapable';
import { link, parenthesis } from '../link';

const syntax = /^(?:!?h)?ttps?:\/\/\S/;
const closer = /^['"`|\[\](){}<>]|^[-+*~^,.;:!?]*(?=[\s|\[\](){}<>]|$)|^\\?(?:\n|$)/;
const escape = /^(?:[0-9a-zA-Z][!?]*h|\?h|[0-9a-gi-zA-Z!?])ttps?:\/\/\S/;

export const url: AutolinkParser.UrlParser = line(source => {
  if (source.search(escape) === 0) return [[document.createTextNode(source.slice(0, source.indexOf(':')))], source.slice(source.indexOf(':'))];
  if (source.search(syntax) !== 0) return;
  const flag = source.startsWith('!h');
  source = flag
    ? source.slice(1)
    : source;
  return transform(
    some<AutolinkParser.UrlParser>(union([ipv6, parenthesis, some(escsource, closer)])),
    (_, rest) => {
      const attribute = source.startsWith('ttp')
        ? ' nofollow'
        : '';
      const url = `${source.startsWith('ttp') ? 'h' : ''}${source.slice(0, source.length - rest.length)}`
        .replace(/\\.?/g, str => str === '\\' ? '' : str);
      return !flag
        ? link(`[](${url}${attribute})${rest}`) as [[HTMLAnchorElement], string]
        : link(`[![](${url})](${url})${rest}`) as [[HTMLAnchorElement], string];
    })
    (source);
}, false);

const ipv6 = transform(
  surround('[', match(/^[:0-9a-z]+/, ([addr], source) => [[document.createTextNode(addr)], source.slice(addr.length)]), ']'),
  (ts, rest) =>
    [[document.createTextNode('['), ...ts, document.createTextNode(']')], rest]);
