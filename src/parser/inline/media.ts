import { MediaParser } from '../inline';
import { Parser, union, inits, some, surround, bind } from '../../combinator';
import { line } from '../source/line';
import { text } from '../source/text';
import { unescsource } from '../source/unescapable';
import { bracket, attribute } from './link';
import { sanitize } from '../string/uri';
import { compress, stringify } from '../util';
import { Cache } from 'spica/cache';
import { html } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(100);

export const media: MediaParser = line(bind(
  line(surround('![', some(union([text]), ']'), /^\](?=\(( ?)[^\n]*?\1\))/, false), false),
  (ts, rest) => {
    const caption = stringify(ts).trim();
    return bind<MediaParser>(
      line(surround(
        '(',
        inits<MediaParser>([
          compress(surround(
            /^ ?(?! )/,
            some(union<Parser<Text, [typeof bracket, typeof unescsource]>>([bracket, unescsource]), new RegExp(`^${rest[1] === ' ' ? ' ' : ''}\\)|^\\s`)),
            /^ ?(?=\))|^ /,
            false)),
          some(surround('', compress(attribute), /^ ?(?=\))|^ /))
        ]),
        ')',
        false
      ), false),
      (ts, rest) => {
        const [INSECURE_URL = '', ...args] = ts.map(t => t.textContent!);
        const uri = sanitize(INSECURE_URL.trim());
        if (uri === '' && INSECURE_URL !== '') return;
        const attrs = new Map<string, string | undefined>(args.map<[string, string | undefined]>(arg => [arg.split('=', 1)[0], arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 1) : undefined]));
        if (uri.trim().toLowerCase().startsWith('tel:')) return;
        const el = html('img', { class: 'media', 'data-src': uri, alt: caption });
        for (const [key, value] of attrs.entries()) {
          switch (key) {
            // @ts-ignore
            case 'nofollow':
              if (value === undefined) continue;
            default:
              void el.classList.add('invalid');
          }
          break;
        }
        if (attrs.size !== args.length) {
          void el.classList.add('invalid');
        }
        if (cache.has(uri)) return [[cache.get(uri)!.cloneNode(true)], rest];
        return [[el], rest];
      })
      (rest);
  }
), false);
