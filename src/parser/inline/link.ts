import { MarkdownParser } from '../../../markdown';
import { LinkParser } from '../inline';
import { State, Backtrack, Command } from '../context';
import { List, Data } from '../../combinator/data/parser';
import { union, inits, sequence, subsequence, some, consume, precedence, state, constraint, surround, open, setBacktrack, dup, lazy, fmap, bind } from '../../combinator';
import { inline, media, shortmedia } from '../inline';
import { attributes } from './html';
import { str } from '../source';
import { trimBlankStart, trimBlankNodeEnd } from '../visibility';
import { unwrap, invalid, stringify } from '../util';
import { ReadonlyURL } from 'spica/url';
import { html, define, defrag } from 'typed-dom/dom';

const optspec = {
  rel: ['nofollow'],
} as const;
Object.setPrototypeOf(optspec, null);

export const textlink: LinkParser.TextLinkParser = lazy(() => constraint(State.link,
  precedence(1, state(State.linkers,
  bind(subsequence([
    dup(surround(
      '[',
      trimBlankStart(some(union([inline]), ']', [[']', 1]])),
      ']',
      true,
      [3 | Backtrack.common, 3 | Backtrack.link, 2 | Backtrack.ruby],
      ([, ns = new List()], context) => {
        if (context.linebreak !== 0) {
          const head = context.position - context.range!;
          return void setBacktrack(context, [2 | Backtrack.link, 2 | Backtrack.ruby], head);
        }
        return ns.push(new Data(Command.Separator)) && ns;
      })),
    // `{ `と`{`で個別にバックトラックが発生し+1nされる。
    // 自己再帰的にパースしてもオプションの不要なパースによる計算量の増加により相殺される。
    dup(surround(
      /{(?![{}])/y,
      inits([uri, some(option)]),
      / ?}/y,
      false, [],
      undefined,
      ([as, bs]) =>
        bs && as.import(bs).push(new Data(Command.Cancel)) && as)),
  ]),
  ([{ value: content }, { value: params = undefined } = {}], context) => {
    if (content.last!.value === Command.Separator) {
      content.pop();
      if (params === undefined) {
        const head = context.position - context.range!;
        return void setBacktrack(context, [2 | Backtrack.link], head);
      }
    }
    else {
      params = content as List<Data<string>>;
      content = new List();
    }
    if (params.last!.value === Command.Cancel) {
      params.pop();
      return new List([
        new Data(html('span',
          {
            class: 'invalid',
            ...invalid('link', 'syntax', 'Missing the closing symbol "}"')
          },
          context.source.slice(context.position - context.range!, context.position)))
      ]);
    }
    assert(!html('div', unwrap(content)).querySelector('a, .media, .annotation, .reference'));
    assert(content.head?.value !== '');
    if (content.length !== 0 && trimBlankNodeEnd(content).length === 0) return;
    return new List([new Data(parse(content, params as List<Data<string>>, context))]);
  })))));

export const medialink: LinkParser.MediaLinkParser = lazy(() => constraint(State.link | State.media,
  state(State.linkers,
  bind(sequence([
    dup(surround(
      '[',
      union([media, shortmedia]),
      ']')),
    dup(surround(/{(?![{}])/y, inits([uri, some(option)]), / ?}/y)),
  ]),
  ([{ value: content }, { value: params }], context) =>
    new List([new Data(parse(content, params as List<Data<string>>, context))])))));

export const uri: LinkParser.ParameterParser.UriParser = union([
  open(/ /y, str(/\S+/y)),
  str(/[^\s{}]+/y),
]);

export const option: LinkParser.ParameterParser.OptionParser = union([
  fmap(str(/ nofollow(?=[ }])/y), () => new List([new Data(' rel="nofollow"')])),
  str(/ [a-z]+(?:-[a-z]+)*(?:="(?:\\[^\n]|[^\\\n"])*")?(?=[ }])/yi),
  str(/ [^\s{}]+/y),
]);

export function parse(
  content: List<Data<string | HTMLElement>>,
  params: List<Data<string>>,
  context: MarkdownParser.Context,
): HTMLAnchorElement {
  assert(params.length > 0);
  const INSECURE_URI = params.shift()!.value;
  assert(INSECURE_URI === INSECURE_URI.trim());
  assert(!INSECURE_URI.match(/\s/));
  consume(10, context);
  let uri: ReadonlyURL | undefined;
  try{
    uri = new ReadonlyURL(
      resolve(INSECURE_URI, context.host ?? location, context.url ?? context.host ?? location),
      context.host?.href || location.href);
  }
  catch {
  }
  const el = elem(
    INSECURE_URI,
    content,
    uri,
    context.host?.origin || location.origin);
  return el.classList.contains('invalid')
    ? el
    : define(el, attributes('link', optspec, unwrap(params))[0]);
}

function elem(
  INSECURE_URI: string,
  content: List<Data<string | HTMLElement>>,
  uri: ReadonlyURL | undefined,
  origin: string,
): HTMLAnchorElement {
  let type: string;
  let message: string;
  switch (uri?.protocol) {
    case undefined:
      type = 'argument';
      message = 'Invalid URI';
      break;
    case 'http:':
    case 'https:':
      assert(uri.host);
      switch (true) {
        case /[0-9a-z]:\S/i.test(stringify(unwrap(content))):
          type = 'content';
          message = 'URI must not be contained';
          break;
        case INSECURE_URI.startsWith('^/')
          && /\/\.\.?(?:\/|$)/.test(INSECURE_URI.slice(0, INSECURE_URI.search(/[?#]|$/))):
          type = 'argument';
          message = 'Dot-segments cannot be used in subresource paths';
          break;
        default:
          return html('a',
            {
              class: content.length === 0 ? 'url' : 'link',
              href: uri.source,
              target: undefined
                || uri.origin !== origin
                || typeof content.head?.value === 'object' && content.head!.value.classList.contains('media')
                  ? '_blank'
                  : undefined,
            },
            content.length === 0
              ? decode(INSECURE_URI)
              : defrag(unwrap(content)));
      }
      break;
    case 'tel:':
      const tel = content.length === 0
        ? INSECURE_URI
        : stringify(unwrap(content));
      const pattern = /^(?:tel:)?(?:\+(?!0))?\d+(?:-\d+)*$/i;
      switch (true) {
        case content.length <= 1
          && pattern.test(INSECURE_URI)
          && typeof tel === 'string'
          && pattern.test(tel)
          && tel.replace(/[^+\d]/g, '') === INSECURE_URI.replace(/[^+\d]/g, ''):
          return html('a',
            {
              class: 'tel',
              href: uri.source,
            },
            content.length === 0
              ? INSECURE_URI
              : defrag(unwrap(content)));
        default:
          type = 'content';
          message = 'Invalid content';
      }
      break;
    default:
      type = 'argument';
      message = 'Invalid protocol';
  }
  return html('a',
    {
      class: 'invalid',
      ...invalid('link', type, message),
    },
    content.length === 0
      ? INSECURE_URI
      : defrag(unwrap(content)));
}

export function resolve(uri: string, host: URL | Location, source: URL | Location): string {
  assert(uri);
  assert(uri === uri.trim());
  switch (true) {
    case uri.startsWith('^/'):
      const last = host.pathname.slice(host.pathname.lastIndexOf('/') + 1);
      return last.includes('.') // isFile
          // Exclude ISO 6709.
          && /^[0-9]*[a-z][0-9a-z]*$/i.test(last.slice(last.lastIndexOf('.') + 1))
        ? `${host.pathname.slice(0, -last.length)}${uri.slice(2)}`
        : `${host.pathname.replace(/\/?$/, '/')}${uri.slice(2)}`;
    case host.origin === source.origin
      && host.pathname === source.pathname:
    case uri.startsWith('//'):
      return uri;
    default:
      const target = new ReadonlyURL(uri, source.href);
      return target.origin === host.origin
        ? target.href.slice(target.origin.length)
        : target.href;
  }
}

export function decode(uri: string): string {
  const head = /^[a-z]+(?:[.+-][0-9a-z]+)*:\/*[^/?#\s]+/i;
  const origin = uri.match(head)?.[0] ?? '';
  try {
    const path = decodeURI(uri.slice(origin.length));
    uri = !origin && head.test(path)
      ? uri.slice(origin.length)
      : origin + path;
  }
  finally {
    return uri.replace(/\s+/g, encodeURI);
  }
}
