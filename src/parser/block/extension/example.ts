import { ExtensionParser } from '../../block';
import { Input, Recursion } from '../../context';
import { Result, Node } from '../../../combinator/parser';
import { inits, recursion, block, fence, lazy } from '../../../combinator';
import { document } from '../../document';
import { mathblock } from '../mathblock';
import { unwrap, invalid } from '../../util';
import { html } from 'typed-dom/dom';

interface Memory {
  readonly body: string;
}

export const example: ExtensionParser.ExampleParser = block(recursion(Recursion.block, inits([
  fence(/(~{3,})(?:example\/(\S+))?(?!\S)([^\r\n]*)(?:$|\r?\n)/y, true),
  (input: Input<Memory>, output) => {
    const [body, overflow, closer, opener, delim, type = 'markdown', param] = unwrap(output.pop()) as string[];
    if (!closer || overflow || param.trimStart()) return output.append(
      new Node(html('pre',
        {
          class: 'invalid',
          translate: 'no',
          ...invalid(
            'example',
            !closer || overflow ? 'fence' : 'argument',
            !closer ? `Missing the closing delimiter "${delim}"` :
              overflow ? `Invalid trailing line after the closing delimiter "${delim}"` :
                'Invalid argument'),
        },
        `${opener}${body}${closer}${overflow}`)));
    switch (type) {
      case 'markdown': {
        input.memory = {
          body,
        };
        return contMD;
      }
      case 'math':
        input.memory = {
          body,
        };
        return contMath;
      default:
        return output.append(
          new Node(html('pre', {
            class: 'invalid',
            translate: 'no',
            ...invalid('example', 'type', 'Invalid example type'),
          }, `${opener}${body}${closer}`)));
    }
  },
])));

const contMD: Result<DocumentFragment | HTMLElement, Input<Memory>> = [
  (input, output) => {
    input = input.scope.push(input.memory.body);
    input.header = true;
    input.local = true;
    input.notes = {
      references: html('ol', { class: 'references' }),
    };
    output.push();
    return output.context;
  },
  lazy(() => document),
  (input, output) => {
    const { notes } = input;
    input = input.scope.pop();
    const doc = output.pop().head!.value;
    return output.append(
      new Node(html('aside',
        { class: 'example', 'data-type': 'markdown' },
        [
          html('pre', { translate: 'no' }, input.memory.body.slice(0, input.memory.body.at(-2) === '\r' ? -2 : -1)),
          html('hr'),
          html('section', [
            // DocumentFragmentを追加すると異常に重くなるので避ける
            ...doc.children,
            html('h2', 'References'),
            notes!.references,
          ]),
        ])));
  },
];

const contMath: Result<HTMLElement, Input<Memory>> = [
  (input, output) => {
    input.scope.push(`$$\n${input.memory.body}$$`);
    output.push();
    return output.context;
  },
  mathblock,
  (input, output) => {
    input = input.scope.pop();
    return output.append(
      new Node(html('aside',
        { class: 'example', 'data-type': 'math' },
        [
          html('pre', { translate: 'no' }, input.memory.body.slice(0, input.memory.body.at(-2) === '\r' ? -2 : -1)),
          html('hr'),
          output.pop().head!.value,
        ])));
  },
];
