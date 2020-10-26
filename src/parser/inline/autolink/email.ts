import { undefined } from 'spica/global';
import { AutolinkParser } from '../../inline';
import { focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

// https://html.spec.whatwg.org/multipage/input.html

export const email: AutolinkParser.EmailParser = creator(focus(
  /^[A-Za-z0-9]+(?:[.+_-][A-Za-z0-9]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*/,
  source => verify(source) && [[html('a', { class: 'email', href: `mailto:${source}`, rel: 'noopener' }, source)], '']));

function verify(source: string): true | undefined {
  return source.indexOf('@') <= 64
      && source.length <= 254
      || undefined;
}
