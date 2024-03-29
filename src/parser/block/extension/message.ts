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
import { sidefence } from '../sidefence';
import { blockquote } from '../blockquote';
import { mediablock } from '../mediablock';
import { paragraph } from '../paragraph';
import { unshift, push } from 'spica/array';
import { html } from 'typed-dom/dom';

import MessageParser = ExtensionParser.MessageParser;

export const message: MessageParser = block(validate('~~~', fmap(
  fence(/^(~{3,})message\/(\S+)([^\n]*)(?:$|\n)/, 300),
  // Bug: Type mismatch between outer and inner.
  ([body, overflow, closer, opener, delim, type, param]: string[], _, context) => {
    if (!closer || overflow || param.trimStart()) return [html('pre', {
      class: 'invalid',
      translate: 'no',
      'data-invalid-syntax': 'message',
      'data-invalid-type': !closer || overflow ? 'fence' : 'argument',
      'data-invalid-message':
        !closer ? `Missing the closing delimiter "${delim}"` :
        overflow ?  `Invalid trailing line after the closing delimiter "${delim}"` :
        'Invalid argument',
    }, `${opener}${body}${overflow || closer}`)];
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
          'data-invalid-type': 'type',
          'data-invalid-message': 'Invalid message type',
        }, `${opener}${body}${closer}`)];
    }
    return [
      html('section', { class: `message`, 'data-type': type }, unshift(
        [html('h1', title(type))],
        [...segment(body)].reduce((acc, seg) => push(acc, eval(content({ source: seg, context }), [])), []))),
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
  sidefence,
  blockquote,
  mediablock,
  paragraph,
]);
