import { MediaParser } from '../inline';
import { Parser, union, inits, some, bind, surround, subline } from '../../combinator';
import { text } from '../source/text';
import { unescsource } from '../source/unescapable';
import { bracket, attribute } from './link';
import { sanitize } from '../string/uri';
import { compress, stringify } from '../util';
import { Cache } from 'spica/cache';
import { memoize } from 'spica/memoization';
import { html, define } from 'typed-dom';

const closer = memoize<string, RegExp>(pattern => new RegExp(`^${pattern}\\)|^\\s`));
const attributes: Record<string, Array<string | undefined>> = {
};

export const cache = new Cache<string, HTMLElement>(100);

export const media: MediaParser = subline(bind(
  subline(surround('![', some(union([text]), ']'), /^\](?=\(( ?)[^\n]*?\1\))/, false)),
  (ts, rest) => {
    const caption = stringify(ts).trim();
    return subline(bind<MediaParser>(
      surround(
        '(',
        inits<MediaParser>([
          surround(
            /^ ?(?! )/,
            compress(some(
              union<Parser<Text, [typeof bracket, typeof unescsource]>>([bracket, unescsource]),
              closer(rest[1] === ' ' ? ' ' : ''))),
            /^ ?(?=\))|^ /,
            false),
          some(surround('', compress(attribute), /^ |^(?=\))/))
        ]),
        ')',
        false),
      (ts, rest) => {
        const [INSECURE_URL = '', ...args]: string[] = ts.map(t => t.textContent!);
        const uri = sanitize(INSECURE_URL.trim());
        if (uri === '' && INSECURE_URL !== '') return;
        if (uri.trim().toLowerCase().startsWith('tel:')) return;
        const attrs: Map<string, string | undefined> = new Map(args.map<[string, string | undefined]>(
          arg => [arg.split('=', 1)[0], arg.includes('=') ? arg.slice(arg.split('=', 1)[0].length + 1) : undefined]));
        const el = html('img', { class: 'media', 'data-src': uri, alt: caption });
        if (attrs.size !== args.length) {
          void el.classList.add('invalid');
        }
        for (const [key, value] of attrs.entries()) {
          if (attributes.hasOwnProperty(key) && attributes[key].includes(value)) continue;
          void el.classList.add('invalid');
        }
        if (cache.has(uri)) {
          const el = cache.get(uri)!.cloneNode(true);
          return [[['img', 'audio', 'video'].includes(el.tagName.toLowerCase()) ? define(el, { alt: caption }) : el], rest];
        }
        return [[el], rest];
      }))
      (rest);
  }));
