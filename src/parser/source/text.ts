import { TextParser } from '../source';
import { creation } from '../../combinator';
import { str } from './str';
import { html, text as txt } from 'typed-dom';

export const separator = /\s|(?=[^A-Za-z0-9\s])[\x00-\x7F]|[A-Za-z0-9][A-Za-z0-9.+_-]*@[A-Za-z0-9]|\S#/;
const next = /[\S\n]|$/;
const repeat = str(/^(.)\1*/);

export const text: TextParser = creation((source, context) => {
  if (source === '') return;
  const i = source.search(separator);
  switch (i) {
    case -1:
      return [[txt(source)], ''];
    case 0:
      switch (source[0]) {
        case '\\':
          switch (source[1]) {
            case void 0:
              return [[], ''];
            case '\n':
              return [[html('span', { class: 'linebreak' }, ' ')], source.slice(2)];
            default:
              return [[txt(source.slice(1, 2))], source.slice(2)];
          }
        case '\n':
          return [[html('br')], source.slice(1)];
        case '*':
          return source[1] === source[0]
            ? repeat(source, context)
            : [[txt(source[0])], source.slice(1)];
        default:
          const i = source[0].trim() === '' ? source.search(next) : 0;
          assert(i !== -1);
          assert(!['\\', '\n'].includes(source[0]));
          return i === source.length
              || source[i] === '\n'
              || source[i] === '\\' && source[i + 1] === '\n'
            ? [[], source.slice(i)]
            : [[txt(source.slice(0, i || 1))], source.slice(i || 1)];
      }
    default:
      return [[txt(source.slice(0, i))], source.slice(i)];
  }
});
