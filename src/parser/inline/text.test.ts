import { loop } from '../../combinator/loop';
import { text } from './text';
import { inspect } from '../debug.test';

describe('Unit: parser/text', () => {
  describe('text', () => {
    const parser = loop(text);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['ab'], '']);
      assert.deepStrictEqual(inspect(parser('a\nb')), [['a', ' ', 'b'], '']);
    });

    it(`'`, () => {
      assert.deepStrictEqual(inspect(parser(`''`)), [[`'`, `'`], '']);
    });

    it('"', () => {
      assert.deepStrictEqual(inspect(parser('""')), [['"', '"'], '']);
    });

    it('`', () => {
      assert.deepStrictEqual(inspect(parser('``')), [['`', '`'], '']);
    });

    it('+', () => {
      assert.deepStrictEqual(inspect(parser('++')), [['+', '+'], '']);
    });

    it('*', () => {
      assert.deepStrictEqual(inspect(parser('**')), [['*', '*'], '']);
    });

    it('^', () => {
      assert.deepStrictEqual(inspect(parser('^^')), [['^', '^'], '']);
    });

    it('~', () => {
      assert.deepStrictEqual(inspect(parser('~~')), [['~', '~'], '']);
    });

    it('[', () => {
      assert.deepStrictEqual(inspect(parser('[[')), [['[', '['], '']);
    });

    it(']', () => {
      assert.deepStrictEqual(inspect(parser(']]')), [[']', ']'], '']);
    });

    it('(', () => {
      assert.deepStrictEqual(inspect(parser('((')), [['(', '('], '']);
    });

    it(')', () => {
      assert.deepStrictEqual(inspect(parser('))')), [[')', ')'], '']);
    });

    it('{', () => {
      assert.deepStrictEqual(inspect(parser('{{')), [['{', '{'], '']);
    });

    it('}', () => {
      assert.deepStrictEqual(inspect(parser('}}')), [['}', '}'], '']);
    });

    it('<', () => {
      assert.deepStrictEqual(inspect(parser('<<')), [['<', '<'], '']);
    });

    it('>', () => {
      assert.deepStrictEqual(inspect(parser('>>')), [['>', '>'], '']);
    });

    it('|', () => {
      assert.deepStrictEqual(inspect(parser('||')), [['|', '|'], '']);
    });

    it('&', () => {
      assert.deepStrictEqual(inspect(parser('&&')), [['&', '&'], '']);
    });

    it(',', () => {
      assert.deepStrictEqual(inspect(parser(',,')), [[',', ','], '']);
    });

    it('.', () => {
      assert.deepStrictEqual(inspect(parser('..')), [['.', '.'], '']);
    });

    it(';', () => {
      assert.deepStrictEqual(inspect(parser(';;')), [[';', ';'], '']);
    });

    it(':', () => {
      assert.deepStrictEqual(inspect(parser('::')), [[':', ':'], '']);
    });

    it('!', () => {
      assert.deepStrictEqual(inspect(parser('!!')), [['!', '!'], '']);
    });

    it('?', () => {
      assert.deepStrictEqual(inspect(parser('??')), [['?', '?'], '']);
    });

    it('space', () => {
      assert.deepStrictEqual(inspect(parser('  ')), [[' ', ' '], '']);
    });

    it('newlinw', () => {
      assert.deepStrictEqual(inspect(parser('\n')), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('\n ')), [[' ', ' '], '']);
      assert.deepStrictEqual(inspect(parser(' \n')), [[' ', ' '], '']);
      assert.deepStrictEqual(inspect(parser('\n\n')), [[' ', ' '], '']);
      assert.deepStrictEqual(inspect(parser(' \n\n')), [[' ', ' ', ' '], '']);
      assert.deepStrictEqual(inspect(parser('\n \n')), [[' ', ' ', ' '], '']);
      assert.deepStrictEqual(inspect(parser('\n\n ')), [[' ', ' ', ' '], '']);
    });

    it('\\', () => {
      assert.deepStrictEqual(inspect(parser('\\')), [[''], '']);
      assert.deepStrictEqual(inspect(parser('\\\\')), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\')), [['\\', ''], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\\\')), [['\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\0')), [['0'], '']);
      assert.deepStrictEqual(inspect(parser('\\a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\a')), [['\\', 'a'], '']);
    });

    it('break', () => {
      assert.deepStrictEqual(inspect(parser('\\\n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\na')), [['<br>', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n')), [['a', '<br>'], '']);
    });

    it('escape', () => {
      assert.deepStrictEqual(inspect(parser('\\!')), [['!'], '']);
      assert.deepStrictEqual(inspect(parser('\\~')), [['~'], '']);
      assert.deepStrictEqual(inspect(parser('\\*')), [['*'], '']);
      assert.deepStrictEqual(inspect(parser('\\`')), [['`'], '']);
      assert.deepStrictEqual(inspect(parser('\\[')), [['['], '']);
      assert.deepStrictEqual(inspect(parser('\\]')), [[']'], '']);
      assert.deepStrictEqual(inspect(parser('\\(')), [['('], '']);
      assert.deepStrictEqual(inspect(parser('\\)')), [[')'], '']);
      assert.deepStrictEqual(inspect(parser('\\{')), [['{'], '']);
      assert.deepStrictEqual(inspect(parser('\\}')), [['}'], '']);
      assert.deepStrictEqual(inspect(parser('\\<')), [['<'], '']);
      assert.deepStrictEqual(inspect(parser('\\>')), [['>'], '']);
      assert.deepStrictEqual(inspect(parser('\\|')), [['|'], '']);
      assert.deepStrictEqual(inspect(parser('\\&')), [['&'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\!')), [['\\', '!'], '']);
    });

    it('uri', () => {
      assert.deepStrictEqual(inspect(parser('http:')), [['h', 't', 'tp', ':'], '']);
      assert.deepStrictEqual(inspect(parser('https:')), [['h', 't', 'tps', ':'], '']);
      assert.deepStrictEqual(inspect(parser('_http:')), [['_', 'h', 't', 'tp', ':'], '']);
      assert.deepStrictEqual(inspect(parser('$http:')), [['$', 'h', 't', 'tp', ':'], '']);
      assert.deepStrictEqual(inspect(parser('+http:')), [['+', 'h', 't', 'tp', ':'], '']);
      assert.deepStrictEqual(inspect(parser('-http:')), [['-', 'h', 't', 'tp', ':'], '']);
      assert.deepStrictEqual(inspect(parser('0http:')), [['0', 'h', 't', 'tp', ':'], '']);
      assert.deepStrictEqual(inspect(parser('ahttp:')), [['a', 'h', 't', 'tp', ':'], '']);
      assert.deepStrictEqual(inspect(parser('Ahttp:')), [['A', 'h', 't', 'tp', ':'], '']);
      assert.deepStrictEqual(inspect(parser('0aAhttp:')), [['0a', 'A', 'h', 't', 'tp', ':'], '']);
      assert.deepStrictEqual(inspect(parser(' http:')), [[' ', 'h', 't', 'tp', ':'], '']);
      assert.deepStrictEqual(inspect(parser('hhttp:')), [['h', 'h', 't', 'tp', ':'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser('@0')), [['@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('_@0')), [['_', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('$@0')), [['$', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('+@0')), [['+', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('-@0')), [['-', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('0@0')), [['0', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('a@0')), [['a', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('A@0')), [['A', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('0aA@0')), [['0a', 'A', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser(' @0')), [[' ', '@', '0'], '']);
      assert.deepStrictEqual(inspect(parser('@@0')), [['@', '@', '0'], '']);
    });

  });

});
