﻿import { ExtensionParser } from '../../block';
import { union, match, block, focus, rewrite, lazy } from '../../../combinator';
import '../../source/unescapable';
import { html } from 'typed-dom';

export const segment: ExtensionParser.GraphParser = block(lazy(() => segment_));

export const segment_: ExtensionParser.GraphParser = block(union([
  focus(
    /^(~{3,})graph\/(sequence|flowchart)[^\S\n]*\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/,
    _ => [[], '']),
  focus(
    /^(~{3,})graph\/(graphviz)[^\S\n]*([a-z]+[^\S\n]*|)\n(?:[^\n]*\n)*?\1[^\S\n]*(?:\n|$)/,
    _ => [[], '']),
]), false);

export const graph: ExtensionParser.GraphParser = block(rewrite(segment, union([
  match(
    /^(~{3,})graph\/(sequence|flowchart)[^\S\n]*\n((?:[^\n]*\n)*?)\1\s*$/,
    ([, , name, body], rest) =>
      [[html('pre', { class: `${name} graph notranslate` }, body.slice(0, -1))], rest]),
  match(
    /^(~{3,})graph\/(graphviz)[^\S\n]*([a-z]+[^\S\n]*|)\n((?:[^\n]*\n)*?)\1\s*$/,
    ([, , name, engine, body], rest) =>
      [[html('pre', { class: `${name} graph notranslate`, 'data-engine': engine.trim() }, body.slice(0, -1))], rest]),
])));
