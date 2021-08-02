import { ExtensionParser } from '../../block';
import { block, validate, fence, creator, fmap } from '../../../combinator';
import { identity } from '../../inline/extension/indexee';
import { parse } from '../../api/parse';
import { html } from 'typed-dom';

export const aside: ExtensionParser.AsideParser = creator(100, block(validate('~~~', fmap(
  fence(/^(~{3,})aside(?!\S)([^\n]*)(?:$|\n)/, 300),
  // Bug: Type mismatch between outer and inner.
  ([body, closer, opener, delim, param]: string[], _, context) => {
    if (!closer || param.trimStart()) return [html('pre', {
      class: 'invalid',
      translate: 'no',
      'data-invalid-syntax': 'aside',
      'data-invalid-type': closer ? 'argument' : 'closer',
      'data-invalid-description': closer ? 'Invalid argument.' : `Missing the closing delimiter ${delim}.`,
    }, `${opener}${body}${closer}`)];
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
    // Bug: Firefox
    //const heading = view.querySelector(':scope > h1:first-child');
    const heading = 'H1 H2 H3 H4 H5 H6'.split(' ').includes(view.firstElementChild?.tagName!) && view.firstElementChild as HTMLHeadingElement;
    if (!heading) return [html('pre', {
      class: 'invalid',
      translate: 'no',
      'data-invalid-syntax': 'aside',
      'data-invalid-type': 'content',
      'data-invalid-description': 'Missing the title at the first line.',
    }, `${opener}${body}${closer}`)];
    assert(identity(heading));
    return [
      html('aside', { id: identity(heading), class: 'aside' }, [
        view,
        annotation,
        reference,
      ]),
    ];
  }))));
