import { ExtensionParser } from '../../block';
import { Node } from '../../../combinator/parser';
import { union, inits, force, block, fence, lazy } from '../../../combinator';
import { build } from '../../parser';
import { parser as segment } from '../../segment';
import { emptysegment } from '../../source';
import { ulist } from '../ulist';
import { olist } from '../olist';
import { ilist } from '../ilist';
import { table } from '../table';
import { codeblock } from '../codeblock';
import { mathblock } from '../mathblock';
import { sidefence } from '../sidefence';
import { blockquote } from '../blockquote';
import { mediablock } from '../mediablock';
import { paragraph } from '../paragraph';
import { unwrap, invalid } from '../../util';
import { html } from 'typed-dom/dom';

import MessageParser = ExtensionParser.MessageParser;

export const message: MessageParser = block(inits([
  fence(/(~{3,})message\/(\S+)(?!\S)([^\r\n]*)(?:$|\r?\n)/y, true),
  (input, output) => {
    const [body, overflow, closer, opener, delim, type, param] = unwrap(output.pop()) as string[];
    if (!closer || overflow || param.trimStart()) {
      output.append(
        new Node(html('pre',
          {
            class: 'invalid',
            translate: 'no',
            ...invalid(
              'message',
              !closer || overflow ? 'fence' : 'argument',
              !closer ? `Missing the closing delimiter "${delim}"` :
                overflow ? `Invalid trailing line after the closing delimiter "${delim}"` :
                  'Invalid argument'),
          },
          `${opener}${body}${closer}${overflow}`)));
      return;
    }
    switch (type) {
      case 'note':
      case 'caution':
      case 'warning':
        break;
      default:
        output.append(
          new Node(html('pre',
            {
              class: 'invalid',
              translate: 'no',
              ...invalid('message', 'type', 'Invalid message type'),
            },
            `${opener}${body}${closer}`)));
        return;
    }
    output.append(
      new Node(html('section',
        {
          class: `message`,
          'data-type': type,
        },
        [html('h1', title(type))])));
    const src = body.slice(0, body.at(-2) === '\r' ? -2 : -1);
    input.scope.focus(src);
    output.push();
    return output.context;
  },
  force(() => cont),
  (input, output) => {
    input.scope.unfocus();
    const content = output.pop();
    output.peek().last!.value.append(...unwrap(content));
    return output.context;
  },
]));

function title(type: string): string {
  switch (type) {
    case 'warning':
      return type.toUpperCase() + '!!';
    case 'caution':
      return type[0].toUpperCase() + type.slice(1) + '!';
    default:
      return type[0].toUpperCase() + type.slice(1);
  }
}

// Must not have indexed blocks.
const cont = build(lazy(() => segment), lazy(() => union([
  emptysegment,
  ulist,
  olist,
  ilist,
  table,
  codeblock,
  mathblock,
  sidefence,
  blockquote,
  mediablock,
  paragraph,
])));
