import { ReferenceParser } from '../inline';
import { union, some, subline, verify, surround, guard, configure, lazy, fmap } from '../../combinator';
import { inline } from '../inline';
import { defrag, trimNodeEnd, hasTightText } from '../util';
import { html } from 'typed-dom';

export const reference: ReferenceParser = lazy(() => subline(verify(fmap(
  guard(config => config?.syntax?.inline?.reference ?? true,
  configure({ syntax: { inline: { annotation: false, reference: false, media: false } } },
  surround('[[', trimNodeEnd(defrag(some(union([inline]), /^\\?\n|^]]/))), ']]'))),
  ns => [html('sup', { class: 'reference' }, ns)]),
  ([el]) => hasTightText(el))));
