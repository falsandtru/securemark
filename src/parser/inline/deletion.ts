import { DeletionParser, inline } from '../inline';
import { union, some, validate, surround, lazy, fmap } from '../../combinator';
import { defrag } from '../util';
import { html } from 'typed-dom';

export const deletion: DeletionParser = lazy(() => fmap(validate(
  /^~~[\s\S]+?~~/,
  union<DeletionParser>([
    surround('~~', defrag(some(union([deletion, some(inline, '~~')]))), '~~'),
    surround('~~', defrag(some(some(inline, '~~'))), '~~'),
  ])),
  ns => [html('del', ns)]));
