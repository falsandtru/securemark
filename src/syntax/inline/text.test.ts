import { loop } from '../../parser/loop';
import { text } from './text';
import { inspect } from '../debug.test';

describe('Unit: syntax/text', () => {
  describe('text', () => {
    it('invalid', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('')), void 0);
    });

    it('ab', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('a')), [['a'], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [['ab'], '']);
    });

    it('`', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('``')), [['`', '`'], '']);
    });

    it('*', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('**')), [['*', '*'], '']);
    });

    it('~', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('~~')), [['~', '~'], '']);
    });

    it('!', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('!!')), [['!', '!'], '']);
    });

    it('<', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('<<')), [['&lt;', '&lt;'], '']);
    });

    it('>', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('>>')), [['&gt;', '&gt;'], '']);
    });

    it('[', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('[[')), [['[', '['], '']);
    });

    it(']', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser(']]')), [[']', ']'], '']);
    });

    it('(', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('((')), [['(', '('], '']);
    });

    it(')', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('))')), [[')', ')'], '']);
    });

    it('|', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('||')), [['|', '|'], '']);
    });

    it('space', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('  ')), [[' ', ' '], '']);
    });

    it('newlinw', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('\n ')), [[' '], '']);
      assert.deepStrictEqual(inspect(parser(' \n')), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('\n\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' \n\n')), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('\n \n')), [[' '], '']);
      assert.deepStrictEqual(inspect(parser('\n\n ')), [[' '], '']);
    });

    it('\\', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('\\')), [[''], '']);
      assert.deepStrictEqual(inspect(parser('\\\\')), [['\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\')), [['\\', ''], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\\\\')), [['\\', '\\'], '']);
      assert.deepStrictEqual(inspect(parser('\\0')), [['0'], '']);
      assert.deepStrictEqual(inspect(parser('\\a')), [['a'], '']);
    });

    it('break', () => {
      const parser = loop(text);
      assert.deepStrictEqual(inspect(parser('\\\n')), [['<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\na')), [['<br>', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('a\\\n')), [['a', '<br>'], '']);
      assert.deepStrictEqual(inspect(parser('\\\\\n')), [['\\'], '']);
    });

    it('escape', () => {
      const parser = loop(text);
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
      const parser = loop(text);
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
