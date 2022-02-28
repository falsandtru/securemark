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
      'data-invalid-type': !closer ? 'closer' : 'argument',
      'data-invalid-description': !closer ? `Missing the closing delimiter "${delim}".` : 'Invalid argument.',
    }, `${opener}${body}${closer}`)];
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
    // Bug: Firefox
    //const heading = document.querySelector(':scope > h1:first-child');
    const heading = 'H1 H2 H3 H4 H5 H6'.split(' ').includes(document.firstElementChild?.tagName!) && document.firstElementChild as HTMLHeadingElement;
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
        document,
        annotations,
        references,
      ]),
    ];
  }))));
