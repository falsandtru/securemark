import { ExtensionParser } from '../../block';
import { eval } from '../../../combinator/data/parser';
import { block, validate, fence, creator, fmap } from '../../../combinator';
import { parse } from '../../api/parse';
import { mathblock } from '../mathblock';
import { html } from 'typed-dom';

const opener = /^(~{3,})(?:example\/(\S+)|(?!\S))([^\n]*)(?:$|\n)/;

export const example: ExtensionParser.ExampleParser = creator(100, block(validate('~~~', fmap(
  fence(opener, 300),
  // Bug: Type mismatch between outer and inner.
  ([body, closer, opener, delim, type = 'markdown', param]: string[], _, context) => {
    if (!closer || param.trimStart()) return [html('pre', {
      class: 'invalid',
      translate: 'no',
      'data-invalid-syntax': 'example',
      'data-invalid-type': !closer ? 'fence' : 'argument',
      'data-invalid-message': !closer ? `Missing the closing delimiter "${delim}"` : 'Invalid argument',
    }, `${opener}${body}${closer}`)];
    switch (type) {
      case 'markdown': {
        const annotations = html('ol', { class: 'annotations' });
        const references = html('ol', { class: 'references' });
        const document = parse(body.slice(0, -1), {
          id: '',
          footnotes: {
            annotations,
            references,
          },
        }, context);
        assert(!document.querySelector('[id]'));
        return [
          html('aside', { class: 'example', 'data-type': 'markdown' }, [
            html('pre', { translate: 'no' }, body.slice(0, -1)),
            html('hr'),
            html('section', [document, annotations, references]),
          ]),
        ];
      }
      case 'math':
        return [
          html('aside', { class: 'example', 'data-type': 'math' }, [
            html('pre', { translate: 'no' }, body.slice(0, -1)),
            html('hr'),
            eval(mathblock(`$$\n${body}$$`, context), [])[0],
          ]),
        ];
      default:
        return [
          html('pre', {
            class: 'invalid',
            translate: 'no',
            'data-invalid-syntax': 'example',
            'data-invalid-message': 'Invalid example type',
          }, `${opener}${body}${closer}`),
        ];
    }
  }))));
