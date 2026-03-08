import { ExtensionParser } from '../../block';
import { Recursion } from '../../context';
import { List, Node, subinput } from '../../../combinator/data/parser';
import { recursion, block, fence, fmap } from '../../../combinator';
import { mathblock } from '../mathblock';
import { unwrap, invalid } from '../../util';
import { parse } from '../../api/parse';
import { html } from 'typed-dom/dom';

export const example: ExtensionParser.ExampleParser = recursion(Recursion.block, block(fmap(
  fence(/(~{3,})(?:example\/(\S+))?(?!\S)([^\n]*)(?:$|\n)/y, 300),
  // Bug: Type mismatch between outer and inner.
  (nodes: List<Node<string>>, context) => {
    const [body, overflow, closer, opener, delim, type = 'markdown', param] = unwrap(nodes);
    if (!closer || overflow || param.trimStart()) return new List([
      new Node(html('pre', {
        class: 'invalid',
        translate: 'no',
        ...invalid(
          'example',
          !closer || overflow ? 'fence' : 'argument',
          !closer ? `Missing the closing delimiter "${delim}"` :
            overflow ? `Invalid trailing line after the closing delimiter "${delim}"` :
              'Invalid argument'),
      }, `${opener}${body}${overflow || closer}`))
    ]);
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
        return new List([
          new Node(html('aside', { class: 'example', 'data-type': 'markdown' }, [
            html('pre', { translate: 'no' }, body.slice(0, -1)),
            html('hr'),
            html('section', [document, html('h2', 'References'), references]),
          ])),
        ]);
      }
      case 'math':
        return new List([
          new Node(html('aside', { class: 'example', 'data-type': 'math' }, [
            html('pre', { translate: 'no' }, body.slice(0, -1)),
            html('hr'),
            mathblock(subinput(`$$\n${body}$$`, context))!.head!.value,
          ])),
        ]);
      default:
        return new List([
          new Node(html('pre', {
            class: 'invalid',
            translate: 'no',
            ...invalid('example', 'type', 'Invalid example type'),
          }, `${opener}${body}${closer}`)),
        ]);
    }
  })));
