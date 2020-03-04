import { RubyParser } from '../inline';
import { sequence, focus, validate, creator, bind, surround, lazy, eval, exec } from '../../combinator';
import { defrag } from '../util';
import { htmlentity } from './htmlentity';
import { html } from 'typed-dom';
import { unshift, push, join } from 'spica/array';

export const ruby: RubyParser = lazy(() => creator(validate('[', bind(
  validate(/^\[(?!\\?\s)(?:\\[^\n]|[^\]\n])+\]\((?:\\[^\n]|[^\)\n])+\)/,
  sequence([
    surround('[', focus(/^(?!\\?\s)(?:\\[^\n]|[^\]\n])+/, text), ']'),
    surround('(', focus(/^(?:\\[^\n]|[^\)\n])+/, text), ')'),
  ])),
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
  }))));

const text: RubyParser.TextParser = creator((source, context) => {
  const { resource } = context;
  const next = /[\s\\&]/;
  const acc = [''];
  let printable = false;
  while (source !== '') {
    assert(source[0] !== '\n');
    resource && void --resource.creation;
    const i = source.search(next);
    switch (i) {
      case -1:
        acc[acc.length - 1] += source;
        printable = printable || !!source.trim();
        source = '';
        continue;
      case 0:
        switch (source[0]) {
          case '\\':
            acc[acc.length - 1] += source[i + 1] || '';
            printable = printable || !!source[i + 1]?.trim();
            source = source.slice(2);
            continue;
          case '&': {
            const result = htmlentity(source, context);
            const str = eval(result, [])[0] || source[0];
            acc[acc.length - 1] += str;
            printable = printable || !!str.trim();
            source = exec(result, source.slice(str.length));
            continue;
          }
          default:
            source[0].trim()
              ? acc[acc.length - 1] += source[0]
              : void acc.push('');
            printable = printable || !!source[0].trim();
            source = source.slice(1);
            continue;
        }
      default:
        acc[acc.length - 1] += source.slice(0, i);
        printable = printable || !!source.slice(0, i).trim();
        source = source.slice(i);
        continue;
    }
  }
  assert(printable === !!acc.join('').trim());
  return printable
    ? [[acc], '']
    : void 0;
});
