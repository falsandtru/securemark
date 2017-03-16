﻿import { loop } from '../../combinator/loop';
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

    it('!', () => {
      assert.deepStrictEqual(inspect(parser('!!')), [['!', '!'], '']);
    });

    it('<', () => {
      assert.deepStrictEqual(inspect(parser('<<')), [['&lt;', '&lt;'], '']);
    });

    it('>', () => {
      assert.deepStrictEqual(inspect(parser('>>')), [['&gt;', '&gt;'], '']);
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

    it('|', () => {
      assert.deepStrictEqual(inspect(parser('||')), [['|', '|'], '']);
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
      assert.deepStrictEqual(inspect(parser('\\|')), [['|'], '']);
      assert.deepStrictEqual(inspect(parser('\\<')), [['&lt;'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\!')), [['\\', '!'], '']);
    });

    it('tag', () => {
      assert.deepStrictEqual(inspect(parser('<')), [['&lt;'], '']);
      assert.deepStrictEqual(inspect(parser('<<')), [['&lt;', '&lt;'], '']);
      assert.deepStrictEqual(inspect(parser('<a')), [['&lt;', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('<a>')), [['&lt;', 'a', '&gt;'], '']);
      assert.deepStrictEqual(inspect(parser('<a></a>')), [['&lt;', 'a', '&gt;', '&lt;', '/a', '&gt;'], '']);
      assert.deepStrictEqual(inspect(parser('<a>a')), [['&lt;', 'a', '&gt;', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('<a>a</a>')), [['&lt;', 'a', '&gt;', 'a', '&lt;', '/a', '&gt;'], '']);
    });

  });

});
