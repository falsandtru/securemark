import { ExtensionParser } from '../../block';
import { block, validate, creator, fmap, clear, fence, eval } from '../../../combinator';
import { suppress } from '../../util';
import { parse } from '../../api/parse';
import { mathblock } from '../mathblock';
import { html } from 'typed-dom';

const opener = /^(~{3,})(?!~)example\/(\S+)([^\n]*)\n?/;

export const segment: ExtensionParser.ExampleParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 100, true))));

export const segment_: ExtensionParser.ExampleParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 100, false))), false);

export const example: ExtensionParser.ExampleParser = block(creator(10, validate('~~~', fmap(
  fence(opener, 100, true),
  // Bug: Remove the annotation.
  ([body, closer, opener, , type, param]: string[], _, context) => {
    if (!closer || param.trim() !== '') return [html('pre', {
      class: 'example notranslate invalid',
      'data-invalid-syntax': 'example',
      'data-invalid-message': `Invalid ${closer ? 'parameter' : 'content'}`,
    }, `${opener}${body}${closer}`)];
    switch (type) {
      case 'markdown': {
        const annotation = html('ol');
        const reference = html('ol');
        const view = parse(body.slice(0, -1), {
          context,
          footnotes: {
            annotation,
            reference,
          },
        });
        return [html('aside', { class: 'example', 'data-type': 'markdown' }, [
          html('pre', body.slice(0, -1)),
          html('div', [suppress(view)]),
          suppress(annotation),
          suppress(reference),
        ])];
      }
      case 'math':
        return [html('aside', { class: 'example', 'data-type': 'math' }, [
          html('pre', body.slice(0, -1)),
          eval(mathblock(`$$\n${body}$$`, context))[0]
        ])];
      default:
        return [html('pre', {
          class: 'example notranslate invalid',
          'data-invalid-syntax': 'example',
          'data-invalid-message': `Invalid example type`,
        }, `${opener}${body}${closer}`)];
    }
  }))));
