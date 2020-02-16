import { AnnotationParser } from '../inline';
import { union, some, creator, backtracker, surround, guard, update, lazy, fmap } from '../../combinator';
import { startTight, defrag } from '../util';
import { inline } from '../inline';
import { str } from '../source';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = lazy(() => creator(fmap(surround(
  '((',
  guard(context => context.syntax?.inline?.annotation ?? true,
  update({ syntax: { inline: {
    annotation: false,
    reference: false,
    extension: true,
    media: false,
    link: true,
    autolink: true,
  }}},
  startTight(union([some(inline, '))')])))),
  backtracker(str('))'))),
  ns => [defrag(html('sup', { class: 'annotation' }, ns))])));
