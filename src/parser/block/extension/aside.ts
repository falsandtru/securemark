import { ExtensionParser } from '../../block';
import { block, validate, fence, fmap } from '../../../combinator';
import { identity, text } from '../../inline/extension/indexee';
import { parse } from '../../api/parse';
import { html } from 'typed-dom/dom';

export const aside: ExtensionParser.AsideParser = block(validate('~~~', fmap(
  fence(/^(~{3,})aside(?!\S)([^\n]*)(?:$|\n)/, 300),
  // Bug: Type mismatch between outer and inner.
  ([body, overflow, closer, opener, delim, param]: string[], _, context) => {
    if (!closer || overflow || param.trimStart()) return [html('pre', {
      class: 'invalid',
      translate: 'no',
      'data-invalid-syntax': 'aside',
      'data-invalid-type': !closer || overflow ? 'fence' : 'argument',
      'data-invalid-message':
        !closer ? `Missing the closing delimiter "${delim}"` :
        overflow ?  `Invalid trailing line after the closing delimiter "${delim}"` :
        'Invalid argument',
    }, `${opener}${body}${overflow || closer}`)];
    const references = html('ol', { class: 'references' });
    const document = parse(body.slice(0, -1), {
      id: '',
      footnotes: {
        references,
      },
    }, context);
    assert(!document.querySelector('[id]'));
    const heading = 'H1 H2 H3 H4 H5 H6'.split(' ').includes(document.firstElementChild?.tagName!) && document.firstElementChild as HTMLHeadingElement;
    if (!heading) return [html('pre', {
      class: 'invalid',
      translate: 'no',
      'data-invalid-syntax': 'aside',
      'data-invalid-type': 'content',
      'data-invalid-message': 'Missing the title at the first line',
    }, `${opener}${body}${closer}`)];
    assert(identity(text(heading)));
    return [
      html('aside', { id: identity(text(heading)), class: 'aside' }, [
        document,
        html('h2', 'References'),
        references,
      ]),
    ];
  })));
