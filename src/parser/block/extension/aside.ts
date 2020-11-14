import { ExtensionParser } from '../../block';
import { block, validate, creator, fmap, clear, fence } from '../../../combinator';
import { identity } from '../../inline/extension/indexee';
import { parse } from '../../api/parse';
import { html } from 'typed-dom';

const opener = /^(~{3,})aside(?!\S)([^\n]*)(?:$|\n)/;

export const segment: ExtensionParser.AsideParser.SegmentParser = block(validate('~~~',
  clear(fence(opener, 1000, true))));

export const aside: ExtensionParser.AsideParser = creator(100, block(validate('~~~', fmap(
  fence(opener, 1000, true),
  // Bug: Type mismatch between outer and inner.
  ([body, closer, opener, delim, param]: string[], _, context) => {
    if (!closer || param.trimStart() !== '') return [html('pre', {
      class: `notranslate invalid`,
      'data-invalid-syntax': 'aside',
      'data-invalid-type': closer ? 'parameter' : 'closer',
      'data-invalid-message': closer ? 'Invalid parameter.' : `Missing closing delimiter ${delim}.`,
    }, `${opener}${body}${closer}`)];
    const annotation = html('ol');
    const reference = html('ol');
    const view = parse(body.slice(0, -1), {
      ...context,
      id: '',
      footnotes: {
        annotation,
        reference,
      },
    });
    // Bug: Firefox
    //const heading = view.querySelector(':scope > h1:first-child');
    const heading = view.firstElementChild?.matches('h1') && view.firstElementChild as HTMLElement || null;
    if (!heading) return [html('pre', {
      class: `notranslate invalid`,
      'data-invalid-syntax': 'aside',
      'data-invalid-type': 'content',
      'data-invalid-message': 'Missing title at the first line.',
    }, `${opener}${body}${closer}`)];
    return [html('aside', { id: identity(heading), class: 'aside' }, [
      view,
      annotation,
      reference,
    ])];
  }))));
