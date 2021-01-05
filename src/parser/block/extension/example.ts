import { ExtensionParser } from '../../block';
import { block, validate, fence, creator, fmap, eval } from '../../../combinator';
import { parse } from '../../api/parse';
import { mathblock } from '../mathblock';
import { html } from 'typed-dom';

const opener = /^(~{3,})example\/(\S+)([^\n]*)(?:$|\n)/;

export const example: ExtensionParser.ExampleParser = creator(100, block(validate('~~~', fmap(
  fence(opener, 300),
  // Bug: Type mismatch between outer and inner.
  ([body, closer, opener, delim, type, param]: string[], _, context) => {
    if (!closer || param.trimStart() !== '') return [html('pre', {
      class: 'notranslate invalid',
      'data-invalid-syntax': 'example',
      'data-invalid-type': closer ? 'argument' : 'closer',
      'data-invalid-description': closer ? 'Invalid argument.' : `Missing the closing delimiter ${delim}.`,
    }, `${opener}${body}${closer}`)];
    switch (type) {
      case 'markdown': {
        const annotation = html('ol', { class: 'annotation' });
        const reference = html('ol', { class: 'reference' });
        const view = parse(body.slice(0, -1), {
          id: '',
          footnotes: {
            annotation,
            reference,
          },
        }, context);
        assert(!view.querySelector('[id]'));
        return [html('aside', { class: 'example', 'data-type': 'markdown' }, [
          html('pre', body.slice(0, -1)),
          html('hr'),
          html('div', [view]),
          annotation,
          reference,
        ])];
      }
      case 'math':
        return [html('aside', { class: 'example', 'data-type': 'math' }, [
          html('pre', body.slice(0, -1)),
          html('hr'),
          eval(mathblock(`$$\n${body}$$`, context), [])[0]
        ])];
      default:
        return [html('pre', {
          class: 'notranslate invalid',
          'data-invalid-syntax': 'example',
          'data-invalid-description': `Invalid example type.`,
        }, `${opener}${body}${closer}`)];
    }
  }))));
