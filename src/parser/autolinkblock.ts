import { MarkdownParser } from '../../markdown';
import { subsequence, some, rewrite, fmap, lazy } from '../combinator';
import { autolink } from './autolink';
import { mention } from './block/paragraph/mention';
import { anyline } from './source';
import { html } from 'typed-dom';
import { push } from 'spica/array';

export import AutolinkblockParser = MarkdownParser.AutolinkblockParser;

export const autolinkblock: AutolinkblockParser = lazy(() => some(subsequence([
  fmap(
    some(mention),
    (es, rest) => {
      es = es.reduce((acc, el) => push(acc, [el, html('br')]), []);
      !rest && es.pop();
      return es;
    }),
  rewrite(
    some(anyline, '>'),
    some(autolink)),
])));
