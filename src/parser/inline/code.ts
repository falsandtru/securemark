import { CodeParser } from '../inline';
import { union, some, match, surround, verify, bind } from '../../combinator';
import { line } from '../source/line';
import { unescsource } from '../source/unescapable';
import { char } from '../source/char';
import { hasText, stringify } from '../util';
import { memoize } from 'spica/memoization';
import { html } from 'typed-dom';

const closer = memoize<string, RegExp>(pattern => new RegExp(`^${pattern}(?!\`)`));

export const code: CodeParser = line(match(
  /^(?=(`+)[^\n]+?\1(?!`))/,
  ([, bracket], source) =>
    verify(bind<CodeParser>(
      surround(bracket, some(union([some(char('`')), unescsource]), closer(bracket)), closer(bracket)),
      (ns, rest) => {
        const el = html('code',
          { 'data-src': source.slice(0, source.length - rest.length) },
          stringify(ns).trim());
        return [[el], rest]
      }), ([el]) => hasText(el))
      (source)
), false);
