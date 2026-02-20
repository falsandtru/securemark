import { ExtensionParser } from '../../block';
import { Recursion } from '../../context';
import { input, eval } from '../../../combinator/data/parser';
import { recursion, block, validate, fence, fmap } from '../../../combinator';
import { mathblock } from '../mathblock';
import { invalid } from '../../util';
import { parse } from '../../api/parse';
import { html } from 'typed-dom/dom';

const opener = /(~{3,})(?:example\/(\S+))?(?!\S)([^\n]*)(?:$|\n)/y;

export const example: ExtensionParser.ExampleParser = recursion(Recursion.block, block(validate('~~~', fmap(
  fence(opener, 300),
  // Bug: Type mismatch between outer and inner.
  ([body, overflow, closer, opener, delim, type = 'markdown', param]: string[], context) => {
    if (!closer || overflow || param.trimStart()) return [html('pre', {
      class: 'invalid',
      translate: 'no',
      ...invalid(
        'example',
        !closer || overflow ? 'fence' : 'argument',
        !closer ? `Missing the closing delimiter "${delim}"` :
          overflow ? `Invalid trailing line after the closing delimiter "${delim}"` :
            'Invalid argument'),
    }, `${opener}${body}${overflow || closer}`)];
    switch (type) {
      case 'markdown': {
        const references = html('ol', { class: 'references' });
        const document = parse(body.slice(0, -1), {
          id: '',
          notes: {
            references,
          },
        }, context);
        assert(!document.querySelector('[id]'));
        return [
          html('aside', { class: 'example', 'data-type': 'markdown' }, [
            html('pre', { translate: 'no' }, body.slice(0, -1)),
            html('hr'),
            html('section', [document, html('h2', 'References'), references]),
          ]),
        ];
      }
      case 'math':
        return [
          html('aside', { class: 'example', 'data-type': 'math' }, [
            html('pre', { translate: 'no' }, body.slice(0, -1)),
            html('hr'),
            eval(mathblock(input(`$$\n${body}$$`, { ...context })), [])[0],
          ]),
        ];
      default:
        return [
          html('pre', {
            class: 'invalid',
            translate: 'no',
            ...invalid('example', 'type', 'Invalid example type'),
          }, `${opener}${body}${closer}`),
        ];
    }
  }))));
