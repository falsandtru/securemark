import { RemarkParser } from '../inline';
import { Recursion } from '../context';
import { List, Node } from '../../combinator/data/parser';
import { union, some, recursion, precedence, focus, surround, close, fallback, lazy } from '../../combinator';
import { inline } from '../inline';
import { text, str } from '../source';
import { unwrap, invalid } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const remark: RemarkParser = lazy(() => fallback(surround(
  str(/\[%(?=[ \n])/y),
  precedence(3, recursion(Recursion.inline,
  some(union([inline]), /[ \n]%\]/y, [[/[ \n]%\]/y, 3]]))),
  close(text, str('%]')),
  true, [],
  ([as, bs = new List(), cs]) => new List([
    new Node(html('span', { class: 'remark' }, [
      html('input', { type: 'checkbox' }),
      html('span', defrag(unwrap(as.import(bs as List<Node<string>>).import(cs)))),
    ])),
  ]),
  ([as, bs]) => bs && as.import(bs as List<Node<string>>)),
  focus(/\[%+(?=[ \n])/y, ({ context: { source } }) => new List([
    new Node(html('span', { class: 'invalid', ...invalid('remark', 'syntax', 'Invalid start symbol') }, source))
  ]))));
