import { AutolinkParser } from '../../inline';
import { creation, verify, rewrite } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom/dom';

// https://html.spec.whatwg.org/multipage/input.html

export const email: AutolinkParser.EmailParser = creation(rewrite(verify(
  str(/^[0-9a-z]+(?:[.+_-][0-9a-z]+)*@[0-9a-z](?:(?:[0-9a-z]|-(?=\w)){0,61}[0-9a-z])?(?:\.[0-9a-z](?:(?:[0-9a-z]|-(?=\w)){0,61}[0-9a-z])?)*(?![0-9a-z])/i),
  ([source]) => source.indexOf('@') <= 64 && source.length <= 255),
  ({ source }) => [[html('a', { class: 'email', href: `mailto:${source}` }, source)], '']));
