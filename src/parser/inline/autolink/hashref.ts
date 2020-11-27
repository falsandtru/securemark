import { AutolinkParser } from '../../inline';
import { validate, focus, creator } from '../../../combinator';
import { html } from 'typed-dom';

export const hashref: AutolinkParser.HashrefParser = creator(validate('#', focus(
  /^#[0-9]+(?![0-9A-Za-z]|[^\x00-\x7F\s])/,
  (source, { url }) => {
    return [[
      html('a',
        {
          class: 'hashref',
          rel: 'noopener',
          target: url && url.origin !== origin ? '_blank' : undefined,
        },
        source)
    ], ''];
  })));
