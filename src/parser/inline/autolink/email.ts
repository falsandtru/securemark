import { AutolinkParser } from '../../inline';
import { creator, verify, rewrite } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom/dom';

// https://html.spec.whatwg.org/multipage/input.html

export const email: AutolinkParser.EmailParser = creator(rewrite(verify(
  str(/^[0-9A-Za-z]+(?:[.+_-][0-9A-Za-z]+)*@[0-9A-Za-z](?:(?:[0-9A-Za-z]|-(?=\w)){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-(?=\w)){0,61}[0-9A-Za-z])?)*(?![0-9A-Za-z])/),
  ([source]) => source.indexOf('@') <= 64 && source.length <= 255),
  source => [[html('a', { class: 'email', href: `mailto:${source}` }, source)], '']));
