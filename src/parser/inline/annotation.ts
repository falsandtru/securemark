import { AnnotationParser } from '../inline';
import { union, some, validate, verify, surround, lazy, override, fmap } from '../../combinator';
import { inline } from '../inline';
import { defrag, trimNodeEnd, hasTightText } from '../util';
import { html } from 'typed-dom';

export const annotation: AnnotationParser = lazy(() => verify(fmap(trimNodeEnd(
  validate(config => config?.syntax?.inline?.annotation ?? true,
  override({ syntax: { inline: { annotation: false, reference: false, media: false } } },
  surround('((', defrag(some(union([inline]), '))')), '))')))),
  ns => [html('sup', { class: 'annotation' }, ns)]),
  ([el]) => hasTightText(el)));
