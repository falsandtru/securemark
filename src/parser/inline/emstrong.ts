import { EmStrongParser, inline } from '../inline';
import { union, some, creator, open, close, lazy, fmap } from '../../combinator';
import { isTight, defrag } from '../util';
import { emphasis } from './emphasis';
import { strong } from './strong';
import { str } from '../source';
import { html } from 'typed-dom';
import { shift, push, pop } from 'spica/array';

export const emstrong: EmStrongParser = lazy(() => creator(fmap(open(
  str('***'), close(
  union([some(inline, '*')]),
  str(/^\*{1,3}/),
  (ns, rest, _, context) => {
    if (!isTight(ns, 0, -1)) return [ns, ns.pop()!.textContent + rest];
    switch (ns[ns.length - 1].textContent) {
      case '*':
        return fmap(
          strong,
          ms =>
            'id' in ms[0]
              ? [defrag(html('strong', [defrag(html('em', pop(ns)[0])), ...ms[0].childNodes]))]
              : push(ns, shift(ms)[1]))
          ('**' + rest, context) || [ns, rest];
      case '**':
        return fmap(
          emphasis,
          ms =>
            'id' in ms[0]
              ? [defrag(html('em', [defrag(html('strong', pop(ns)[0])), ...ms[0].childNodes]))]
              : push(ns, shift(ms)[1]))
          ('*' + rest, context) || [ns, rest];
      case '***':
        return [[html('em', [defrag(html('strong', pop(ns)[0]))])], rest];
      default:
        return [ns, rest];
    }
  })),
  ns => 'id' in ns[1] && ['EM', 'STRONG'].includes(ns[1].tagName) ? shift(ns)[1] : ns)));
