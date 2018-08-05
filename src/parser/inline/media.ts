import { MediaParser } from '../inline';
import { union, some, surround, bind } from '../../combinator';
import { line } from '../source/line';
import { text } from '../source/text';
import { unescsource } from '../source/unescapable';
import { bracket } from './link';
import { sanitize } from '../string/uri';
import { compress, stringify } from '../util';
import { Cache } from 'spica/cache';
import { html } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(100);

export const media: MediaParser = line(bind(
  line(surround('![', some(union([text]), ']'), ']', false), false),
  (ts, rest) => {
    const caption = stringify(ts).trim();
    const [{ length: count }] = rest.match(/^\(+/) || ['('];
    return bind<MediaParser>(
      line(surround(
        '('.repeat(count),
        compress(surround(/^ ?(?! )/, some(union([bracket, unescsource]), new RegExp(`^\\){${count}}|^\\s`)), /^ ?(?=\))/, false)),
        ')'.repeat(count),
        false
      ), false),
      (ts, rest) => {
        assert(ts.length <= 1);
        const [INSECURE_URL = ''] = ts.map(t => t.textContent!);
        const uri = sanitize(INSECURE_URL.trim());
        if (uri === '' && INSECURE_URL !== '') return;
        if (uri.trim().toLowerCase().startsWith('tel:')) return;
        if (cache.has(uri)) return [[cache.get(uri)!.cloneNode(true)], rest];
        return [[html('img', { class: 'media', 'data-src': uri, alt: caption })], rest];
      })
      (rest);
  }
), false);
