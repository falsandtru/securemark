import { RubyParser } from '../inline';
import { sequence, creator, focus, bind, surround, lazy, eval, exec } from '../../combinator';
import { defrag } from '../util';
import { htmlentity } from './htmlentity';
import { html } from 'typed-dom';
import { unshift, push, join } from 'spica/array';

export const ruby: RubyParser = lazy(() => creator(bind(
  sequence([
    surround('[', focus(/^(?!\\?\s)(?:\\[^\n]|[^\]\n])+/, text), ']'),
    surround('(', focus(/^(?:\\[^\n]|[^\)\n])+/, text), ')'),
  ]),
  ([texts, rubies], rest) => {
    switch (true) {
      case rubies.length <= texts.length:
        return [[html('ruby', defrag(texts
          .reduce<(HTMLElement | string)[]>((acc, _, i) =>
            push(acc, unshift([texts[i]],
              i < rubies.length && rubies[i].trim() !== ''
                ? [html('rp', '('), html('rt', rubies[i]), html('rp', ')')]
                : [html('rt')] as typeof acc))
          , [])))], rest];
      case texts.length === 1 && [...texts[0]].length >= rubies.length:
        return [[html('ruby', defrag([...texts[0]]
          .reduce<(HTMLElement | string)[]>((acc, _, i, texts) =>
            push(acc, unshift([texts[i]],
              i < rubies.length && rubies[i].trim() !== ''
                ? [html('rp', '('), html('rt', rubies[i]), html('rp', ')')]
                : [html('rt')] as typeof acc))
          , [])))], rest];
      default:
        return [[
          html('ruby', defrag(unshift<HTMLElement | string>(
            [join(texts, ' ')],
            rubies.length === 0
              ? []
              : [
                  html('rp', '('),
                  html('rt', join(rubies, ' ')),
                  html('rp', ')'),
                ])))
        ], rest];
    }
  })));

const text: RubyParser.TextParser = creator((source, context) => {
  const acc = [''];
  let printable = false;
  for (let i = 0; i < source.length; ++i) {
    switch (source[i].trim()) {
      case '':
        void acc.push('');
        continue;
      case '\\':
        acc[acc.length - 1] += source[++i];
        printable = printable || !!source[i].trim();
        continue;
      case '&': {
        const result = htmlentity(source.slice(i), context);
        const str = eval(result, [])[0] || source[i];
        const rest = exec(result, source.slice(i + str.length));
        acc[acc.length - 1] += str;
        printable = printable || !!str.trim();
        i = source.length - rest.length - 1;
        continue;
      }
      default:
        acc[acc.length - 1] += source[i];
        printable = printable || !!source[i];
        continue;
    }
  }
  assert(printable === !!acc.join('').trim());
  return printable
    ? [[acc], '']
    : void 0;
});
