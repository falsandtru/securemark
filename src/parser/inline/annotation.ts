import { AnnotationParser } from '../inline';
import { Ctx, union, some, creator, backtracker, surround, clear, guard, context, lazy, bind } from '../../combinator';
import { startTight, isTight, trimEnd, defrag } from '../util';
import { inline } from '../inline';
import { str } from '../source';
import { html } from 'typed-dom';
import { DeepMutable } from 'spica/type';

export const annotation: AnnotationParser = lazy(() => creator(bind(surround(
  '((',
  guard(context => context.syntax?.inline?.annotation ?? true,
  context({ syntax: { inline: {
    annotation: false,
    reference: false,
    extension: true,
    media: false,
    link: true,
    autolink: true,
  }}},
  startTight(union([some(inline, '))')])))),
  backtracker(clear(str('))')))),
  (ns, rest, _, context: DeepMutable<Ctx>) =>
    isTight(ns, 0, ns.length) || context.resource && void --context.resource.backtrack
      ? [[defrag(html('sup', { class: 'annotation' }, trimEnd(ns)))], rest]
      : void 0)));
