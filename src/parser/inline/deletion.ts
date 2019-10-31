import { DeletionParser, inline } from '../inline';
import { union, some, validate, surround, lazy, override, fmap } from '../../combinator';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const deletion: DeletionParser = lazy(() => fmap(validate(
  /^~~[\s\S]+?~~/,
  validate(config => config?.syntax?.inline?.deletion ?? true,
  override({ syntax: { inline: { insertion: false, deletion: false } } },
  surround('~~', defrag(some(union([inline]), '~~')), '~~')))),
  ns => [html('del', ns)]));
