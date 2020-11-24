import { undefined } from 'spica/global';
import { AutolinkParser } from '../../inline';
import { focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

// https://html.spec.whatwg.org/multipage/input.html

export const email: AutolinkParser.EmailParser = creator(focus(
  /^[0-9A-Za-z]+(?:[.+_-][0-9A-Za-z]+)*@[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:[0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*/,
  source => verify(source) && [[html('a', { class: 'email', href: `mailto:${source}`, rel: 'noopener' }, source)], '']));

function verify(source: string): true | undefined {
  return source.indexOf('@') <= 64
      && source.length <= 254
      || undefined;
}
