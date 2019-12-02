import { AnnotationParser } from '../inline';
import { union, some, verify, surround, guard, configure, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { defrag, trimTextEnd, hasTightText } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = lazy(() => verify(fmap(
  guard(config => config?.syntax?.inline?.annotation ?? true,
  configure({ syntax: { inline: { annotation: false, reference: false, media: false } } },
  surround('((', trimTextEnd(defrag(some(union([inline]), '))'))), '))'))),
  ns => [html('sup', { class: 'annotation' }, ns)]),
  ([el]) => hasTightText(el)));
