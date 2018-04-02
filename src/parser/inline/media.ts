import { MediaParser } from '../inline';
import { union, some, surround, transform, build } from '../../combinator';
import { line } from '../source/line';
import { text } from '../source/text';
import { parenthesis } from '../source/parenthesis';
import { sanitize } from '../string/url';
import { stringify } from '../util';
import { Cache } from 'spica/cache';
import { html } from 'typed-dom';

export const cache = new Cache<string, HTMLElement>(100);

export const media: MediaParser = line(transform(build(() =>
  line<MediaParser>(surround('![', some(union([text]), ']'), ']'), false)),
  (ts, rest) => {
    const caption = stringify(ts).trim();
    return transform(
      line<MediaParser>(surround('(', some(union([parenthesis, text]), /^\)|^\s/), ')'), false),
      (ts, rest) => {
        const url = sanitize(stringify(ts));
        if (url === '') return;
        if (cache.has(url)) return [[cache.get(url)!.cloneNode(true)], rest];
        return [[html('img', { class: 'media', 'data-src': url, alt: caption })], rest];
      })
      (rest);
  }
), false);
