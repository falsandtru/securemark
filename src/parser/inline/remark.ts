import { RemarkParser } from '../inline';
import { Recursion } from '../context';
import { List, Data } from '../../combinator/data/parser';
import { union, some, recursion, precedence, focus, surround, close, fallback, lazy } from '../../combinator';
import { inline } from '../inline';
import { text, str } from '../source';
import { unwrap, invalid } from '../util';
import { html, defrag } from 'typed-dom/dom';

export const remark: RemarkParser = lazy(() => fallback(surround(
  str(/\[%(?=\s)/y),
  precedence(3, recursion(Recursion.inline,
  some(union([inline]), /\s%\]/y, [[/\s%\]/y, 3]]))),
  close(text, str(`%]`)), true,
  ([as, bs = new List(), cs]) => new List([
    new Data(html('span', { class: 'remark' }, [
      html('input', { type: 'checkbox' }),
      html('span', defrag(unwrap(as.import(bs as List<Data<string>>).import(cs)))),
    ])),
  ]),
  ([as, bs]) => bs && as.import(bs as List<Data<string>>)),
  focus(/\[%+(?=\s)/y, ({ context: { source } }) => new List([
    new Data(html('span', { class: 'invalid', ...invalid('remark', 'syntax', 'Invalid start symbol') }, source))
  ]))));
