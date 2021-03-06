import { undefined } from 'spica/global';
import { AutolinkParser } from '../../inline';
import { rewrite, creator, open } from '../../../combinator';
import { str } from '../../source';
import { html } from 'typed-dom';

export const hashref: AutolinkParser.HashrefParser = creator(rewrite(
  open('#', str(/^[0-9]{1,16}(?![0-9A-Za-z'_]|[^\x00-\x7F\s])/)),
  (source, { host, url }) => [[
    html('a',
      {
        class: 'hashref',
        target: url && url.origin !== host?.origin
          ? '_blank'
          : undefined,
      },
      source)
  ], '']));
