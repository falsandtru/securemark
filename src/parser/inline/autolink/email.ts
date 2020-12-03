import { AutolinkParser } from '../../inline';
import { sequence, verify, rewrite, creator } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom';

// https://html.spec.whatwg.org/multipage/input.html

export const email: AutolinkParser.EmailParser = creator(rewrite(
  sequence([
    verify(
      str(/^[0-9A-Za-z]+(?:[.+_-][0-9A-Za-z]+)*@/),
      ([source]) => source.length <= 63 + 1),
    verify(
      str(/^[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*/),
      ([source]) => source.length <= 256 - 63 - 1),
  ]),
  source => [[html('a', { class: 'email', href: `mailto:${source}`, rel: 'noopener' }, source)], '']));
