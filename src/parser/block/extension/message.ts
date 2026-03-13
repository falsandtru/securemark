import { ExtensionParser } from '../../block';
import { List, Node, subinput } from '../../../combinator/data/parser';
import { union, block, fence, fmap } from '../../../combinator';
import { segment } from '../../segment';
import { emptyline } from '../../source';
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
import { push } from 'spica/array';
import { html } from 'typed-dom/dom';

import MessageParser = ExtensionParser.MessageParser;

export const message: MessageParser = block(fmap(
  fence(/(~{3,})message\/(\S+)(?!\S)([^\n]*)(?:$|\n)/y, 300),
  // Bug: Type mismatch between outer and inner.
  (nodes: List<Node<string>>, context) => {
    const [body, overflow, closer, opener, delim, type, param] = unwrap(nodes);
    if (!closer || overflow || param.trimStart()) return new List([
      new Node(html('pre', {
        class: 'invalid',
        translate: 'no',
        ...invalid(
          'message',
          !closer || overflow ? 'fence' : 'argument',
          !closer ? `Missing the closing delimiter "${delim}"` :
            overflow ? `Invalid trailing line after the closing delimiter "${delim}"` :
              'Invalid argument'),
      }, `${opener}${body}${overflow || closer}`))
    ]);
    switch (type) {
      case 'note':
      case 'caution':
      case 'warning':
        break;
      default:
        return new List([
          new Node(html('pre', {
            class: 'invalid',
            translate: 'no',
            ...invalid('message', 'type', 'Invalid message type'),
          }, `${opener}${body}${closer}`))
        ]);
    }
    return new List([
      new Node(html('section',
        {
          class: `message`,
          'data-type': type,
        },
        [...segment(body)].reduce(
          (acc, [seg]) =>
            push(acc, unwrap(content(subinput(seg, context)))),
          [html('h1', title(type))])))
    ]);
  }));

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
const content: MessageParser.ContentParser = union([
  emptyline,
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
]);
