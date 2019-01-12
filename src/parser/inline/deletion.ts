import { DeletionParser, inline } from '../inline';
import { union, some, validate, verify, surround, lazy, fmap } from '../../combinator';
import { defrag, hasInsOrDel } from '../util';
import { html } from 'typed-dom';

export const deletion: DeletionParser = lazy(() => verify(fmap(validate(
  /^~~[\s\S]+?~~/,
  surround('~~', defrag(some(some(union([inline]), '~~'))), '~~')),
  ns => [html('del', ns)]),
  ([el]) => !hasInsOrDel(el)));
