import { AnnotationParser } from '../inline';
import { union, some, creator, backtracker, surround, guard, update, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { str } from '../source';
import { defrag, startTight } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = lazy(() => creator(fmap(surround(
  '((',
  guard(context => context.syntax?.inline?.annotation ?? true,
  update({ syntax: { inline: {
    annotation: false,
    reference: false,
    extension: false,
    media: false,
    link: true,
    autolink: true,
  }}},
  startTight(union([some(inline, '))')])))),
  backtracker(str('))'))),
  ns => [html('sup', { class: 'annotation' }, defrag(ns))])));
