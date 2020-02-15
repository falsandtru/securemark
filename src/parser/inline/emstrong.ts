import { EmStrongParser, inline } from '../inline';
import { union, some, creator, open, close, lazy, fmap, bind } from '../../combinator';
import { defrag, startTight } from '../util';
import { emphasis } from './emphasis';
import { strong } from './strong';
import { str } from '../source';
import { html } from 'typed-dom';
import { shift, push } from 'spica/array';

export const emstrong: EmStrongParser = lazy(() => creator(bind(open(
  str('***'), close(
  startTight(union([some(inline, '*')])),
  str(/^\*{1,3}/), true)),
  (ns, rest, _, context) => {
    if (ns.length === 1) return;
    switch (ns[ns.length - 1].textContent) {
      case '*':
        return fmap(
          strong,
          ms =>
            'id' in ms[0]
              ? [defrag(html('strong', [defrag(html('em', ns.slice(1, -1))), ...ms[0].childNodes]))]
              : push(ns, shift(ms)[1]))
          ('**' + rest, context) || [ns, rest];
      case '**':
        return fmap(
          emphasis,
          ms =>
            'id' in ms[0]
              ? [defrag(html('em', [defrag(html('strong', ns.slice(1, -1))), ...ms[0].childNodes]))]
              : push(ns, shift(ms)[1]))
          ('*' + rest, context) || [ns, rest];
      case '***':
        return [[html('em', [defrag(html('strong', ns.slice(1, -1)))])], rest];
      default:
        return [ns, rest];
    }
  })));
