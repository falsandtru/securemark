import { ReferenceParser } from '../inline';
import { union, some, subline, validate, verify, surround, lazy, override, fmap } from '../../combinator';
import { inline } from '../inline';
import { defrag, trimNodeEnd, hasTightText } from '../util';
import { html } from 'typed-dom';

export const reference: ReferenceParser = lazy(() => subline(verify(fmap(trimNodeEnd(
  validate(config => config?.syntax?.inline?.reference ?? true,
  override({ syntax: { inline: { annotation: false, reference: false, media: false } } },
  surround('[[', defrag(some(union([inline]), /^\\?\n|^]]/)), ']]')))),
  ns => [html('sup', { class: 'reference' }, ns)]),
  ([el]) => hasTightText(el))));
