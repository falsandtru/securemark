import { MediaParser } from '../inline';
import { union, some, surround, bind } from '../../combinator';
import { line } from '../source/line';
import { text } from '../source/text';
import { unescsource } from '../source/unescapable';
import { bracket } from './link';
import { sanitize } from '../string/uri';
import { stringify } from '../util';
import { Cache } from 'spica/cache';
import { html } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(100);

export const media: MediaParser = line(bind(
  line(surround('![', some(union([text]), ']'), ']', false), false),
  (ts, rest) => {
    const caption = stringify(ts).trim();
    const [{ length: count }] = rest.match(/^\(+/) || ['('];
    return bind<MediaParser>(
      line(surround('('.repeat(count), some(union([bracket, unescsource]), new RegExp(`^\\){${count}}|^ (?!\\))|^[^\\S ]`)), ')'.repeat(count)), false),
      (ts, rest) => {
        const uri = sanitize(stringify(ts).trim());
        if (uri === '') return;
        if (cache.has(uri)) return [[cache.get(uri)!.cloneNode(true)], rest];
        if (uri.trim().toLowerCase().startsWith('tel:')) return;
        return [[html('img', { class: 'media', 'data-src': uri, alt: caption })], rest];
      })
      (rest);
  }
), false);
