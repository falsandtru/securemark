import { ExtensionParser, inline } from '../../inline';
import { union, some, creation, backtrack, surround, update, lazy, fmap } from '../../../combinator';
import { str } from '../../source';
import { defrag, startTight } from '../../util';
import { html } from 'typed-dom';

// Already used symbols: !@$&*<
export const placeholder: ExtensionParser.PlaceholderParser = lazy(() => creation(fmap(surround(
  /^\[[:^]/,
  update({ syntax: { inline: {
    link: false,
    media: false,
    annotation: false,
    reference: false,
    extension: false,
    autolink: false,
  }}},
  startTight(some(union([inline]), ']'))),
  backtrack(str(']'))),
  ns =>
    [html('span', { class: 'invalid', 'data-invalid-syntax': 'extension', 'data-invalid-message': 'Invalid flag' }, defrag(ns))])));
