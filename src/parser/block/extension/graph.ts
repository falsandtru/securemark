import { ExtensionParser } from '../../block';
import { union, block, rewrite, focus, match, trim, lazy } from '../../../combinator';
import '../../source/unescapable';
import { html } from 'typed-dom';

export const segment: ExtensionParser.GraphParser.SegmentParser = lazy(() => block(segment_));

export const segment_: ExtensionParser.GraphParser.SegmentParser = block(union([
  focus(
    /^(~{3,})graph\/(sequence|flowchart)[^\S\n]*\n(?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,99}\1[^\S\n]*(?:\n|$)/,
    _ => [[], '']),
  focus(
    /^(~{3,})graph\/(graphviz)[^\S\n]*([a-z]+[^\S\n]*|)\n(?:(?!\1[^\S\n]*(?:\n|$))[^\n]*\n){0,99}\1[^\S\n]*(?:\n|$)/,
    _ => [[], '']),
]), false);

export const graph: ExtensionParser.GraphParser = block(rewrite(segment, trim(union([
  match(
    /^(~{3,})graph\/(sequence|flowchart)[^\S\n]*\n([\s\S]*)\1$/,
    ([, , name, body]) => rest =>
      [[html('pre', { class: `${name} graph notranslate` }, body.slice(0, -1))], rest]),
  match(
    /^(~{3,})graph\/(graphviz)[^\S\n]*([a-z]+[^\S\n]*|)\n([\s\S]*)\1$/,
    ([, , name, engine, body]) => rest =>
      [[html('pre', { class: `${name} graph notranslate`, 'data-engine': engine.trim() }, body.slice(0, -1))], rest]),
]))));
