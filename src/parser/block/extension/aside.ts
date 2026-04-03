import { ExtensionParser } from '../../block';
import { Input, Recursion } from '../../context';
import { Node } from '../../../combinator/parser';
import { inits, recursion, block, fence, lazy } from '../../../combinator';
import { document } from '../../document';
import { identity } from '../../inline/extension/indexee';
import { unwrap, invalid } from '../../util';
import { html } from 'typed-dom/dom';

interface Memory {
  readonly opener: string;
  readonly body: string;
  readonly closer: string;
}

export const aside: ExtensionParser.AsideParser = block(recursion(Recursion.block, inits([
  fence(/(~{3,})aside(?!\S)([^\r\n]*)(?:$|\r?\n)/y, true),
  (input: Input<Memory>, output) => {
    const [body, overflow, closer, opener, delim, param] = unwrap(output.pop()) as string[];
    if (!closer || overflow || param.trimStart()) {
      output.append(
        new Node(html('pre',
          {
            class: 'invalid',
            translate: 'no',
            ...invalid(
              'aside',
              !closer || overflow ? 'fence' : 'argument',
              !closer ? `Missing the closing delimiter "${delim}"` :
                overflow ? `Invalid trailing line after the closing delimiter "${delim}"` :
                  'Invalid argument'),
          },
          `${opener}${body}${overflow || closer}`)));
      return;
    }
    input.memory = {
      opener,
      body,
      closer,
    };
    input = input.scope.push(body);
    input.header = true;
    input.local = true;
    input.notes = {
      references: html('ol', { class: 'references' }),
    };
    output.push();
    return output.context;
  },
  lazy(() => document),
  (input: Input<Memory>, output) => {
    const { notes } = input;
    input = input.scope.pop();
    const { memory: { opener, body, closer } } = input;
    const doc = output.pop().head!.value;
    const heading = 'H1 H2 H3 H4 H5 H6'.split(' ').includes(doc.firstElementChild?.tagName!) && doc.firstElementChild as HTMLHeadingElement;
    if (!heading) {
      return output.append(
        new Node(html('pre',
          {
            class: 'invalid',
            translate: 'no',
            ...invalid('aside', 'content', 'Missing the title at the first line'),
          },
          `${opener}${body}${closer}`)));
    }
    assert(identity('index', input.id, heading));
    return output.append(
      new Node(html('aside',
        {
          id: identity('index', input.id, heading),
          class: 'aside',
        },
        [
          doc,
          html('h2', 'References'),
          notes!.references,
        ])));
  },
])));
