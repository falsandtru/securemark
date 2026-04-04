import { MathBlockParser } from '../block';
import { Node } from '../../combinator/parser';
import { inits, block, fence } from '../../combinator';
import { unwrap, invalid } from '../util';
import { html } from 'typed-dom/dom';

const opener = /(\${2,})(?!\$)([^\r\n]*)(?:$|\r?\n)/y;

export const segment: MathBlockParser.SegmentParser = block(
  fence(opener, false));

export const segment_: MathBlockParser.SegmentParser = block(
  fence(opener, false, false), false);

export const mathblock: MathBlockParser = block(inits([
  fence(opener, true),
  ({ caches: { math: cache = undefined } = {} }, output) => {
    const [body, overflow, closer, opener, delim, param] = unwrap(output.pop()) as string[];
    return output.append(
      delim.length === 2 && closer && !overflow && param.trimStart() === ''
        ? new Node(cache?.get(`${delim}\n${body}${delim}`)?.cloneNode(true) as HTMLDivElement ||
          html('div', { class: 'math', translate: 'no' }, `${delim}\n${body}${delim}`))
        : new Node(html('pre',
            {
              class: 'invalid',
              translate: 'no',
              ...invalid(
                'mathblock',
                delim.length > 2 ? 'syntax' : !closer || overflow ? 'fence' : 'argument',
                delim.length > 2 ? 'Invalid syntax' :
                  !closer ? `Missing the closing delimiter "${delim}"` :
                    overflow ? `Invalid trailing line after the closing delimiter "${delim}"` :
                      'Invalid argument'),
            },
            `${opener}${body}${closer}${overflow}`)));
  },
]));
