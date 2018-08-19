import { CodeParser } from '../inline';
import { union, some, bind, match, surround, subline, verify } from '../../combinator';
import { unescsource } from '../source/unescapable';
import { char } from '../source/char';
import { stringify, hasText } from '../util';
import { memoize } from 'spica/memoization';
import { html } from 'typed-dom';

const closer = memoize<string, RegExp>(pattern => new RegExp(`^${pattern}(?!\`)`));

export const code: CodeParser = subline(match(
  /^(?=(`+)[^\n]+?\1(?!`))/,
  ([, bracket], source) =>
    verify<CodeParser>(bind(
      stringify(
        surround(bracket, some(union([some(char('`')), unescsource]), closer(bracket)), closer(bracket))),
      (ss, rest) =>
        [[html('code', { 'data-src': source.slice(0, source.length - rest.length) }, ss.join('').trim())], rest]),
      ([el]) => hasText(el))
      (source)));
