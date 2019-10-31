import { DeletionParser, inline } from '../inline';
import { union, some, validate, surround, check, configure, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const deletion: DeletionParser = lazy(() => fmap(validate(
  /^~~[\s\S]+?~~/,
  check(config => config?.syntax?.inline?.deletion ?? true,
  configure({ syntax: { inline: { insertion: false, deletion: false } } },
  surround('~~', defrag(some(union([inline]), '~~')), '~~')))),
  ns => [html('del', ns)]));
