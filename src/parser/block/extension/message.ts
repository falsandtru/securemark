import { ExtensionParser } from '../../block';
import { eval } from '../../../combinator/data/parser';
import { union, block, validate, fence, fmap } from '../../../combinator';
import { segment } from '../../segment';
import { emptyline } from '../../source';
import { ulist } from '../ulist';
import { olist } from '../olist';
import { ilist } from '../ilist';
import { table } from '../table';
import { codeblock } from '../codeblock';
import { mathblock } from '../mathblock';
import { blockquote } from '../blockquote';
import { paragraph } from '../paragraph';
import { html } from 'typed-dom';
import { unshift, push } from 'spica/array';

import MessageParser = ExtensionParser.MessageParser;

export const message: MessageParser = block(validate('~~~', fmap(
  fence(/^(~{3,})message\/(\S+)([^\n]*)(?:$|\n)/, 300),
  // Bug: Type mismatch between outer and inner.
  ([body, closer, opener, delim, type, param]: string[], _, context) => {
    if (!closer || param.trimStart()) return [html('pre', {
      class: 'invalid',
      translate: 'no',
      'data-invalid-syntax': 'message',
      'data-invalid-type': !closer ? 'closer' : 'argument',
      'data-invalid-message': !closer ? `Missing the closing delimiter "${delim}".` : 'Invalid argument.',
    }, `${opener}${body}${closer}`)];
    switch (type) {
      case 'note':
      case 'caution':
      case 'warning':
        break;
      default:
        return [html('pre', {
          class: 'invalid',
          translate: 'no',
          'data-invalid-syntax': 'message',
          'data-invalid-message': 'Invalid message type.',
        }, `${opener}${body}${closer}`)];
    }
    return [
      html('div', { class: `message type-${type}` }, unshift(
        [html('h6', title(type))],
        [...segment(body)].reduce((acc, seg) => push(acc, eval(content(seg, context), [])), []))),
    ];
  })));

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
  blockquote,
  paragraph,
]);
