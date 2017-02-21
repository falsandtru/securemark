﻿import { loop } from '../../combinator/loop';
import { blockquote } from './blockquote';
import { inspect } from '../debug.test';

describe('Unit: parser/blockquote', () => {
  describe('blockquote', () => {
    const parser = loop(blockquote);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('>')), void 0);
      assert.deepStrictEqual(inspect(parser('> ')), void 0);
      assert.deepStrictEqual(inspect(parser('>>')), void 0);
      assert.deepStrictEqual(inspect(parser(' >')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('>a')), [['<blockquote>a</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n')), [['<blockquote>a</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\n>b')), [['<blockquote>a<br>b</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>a\nb')), [['<blockquote>a<br>b</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a')), [['<blockquote>a</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n')), [['<blockquote>a</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n> b')), [['<blockquote>a<br>b</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\nb')), [['<blockquote>a<br>b</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n\nb')), [['<blockquote>a</blockquote>'], 'b']);
      assert.deepStrictEqual(inspect(parser('> a\nb\nc')), [['<blockquote>a<br>b<br>c</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\nb\n\nc')), [['<blockquote>a<br>b</blockquote>'], 'c']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n> c')), [['<blockquote>a<blockquote>b</blockquote>c</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n>> c')), [['<blockquote>a<blockquote>b<br>c</blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('> a\n>> b\n>>> c')), [['<blockquote>a<blockquote>b<blockquote>c</blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a')), [['<blockquote><blockquote>a</blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n> b')), [['<blockquote><blockquote>a</blockquote>b</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n>>> b\n> c')), [['<blockquote><blockquote>a<blockquote>b</blockquote></blockquote>c</blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>> a\n> b\n>>> c')), [['<blockquote><blockquote>a</blockquote>b<blockquote><blockquote>c</blockquote></blockquote></blockquote>'], '']);
      assert.deepStrictEqual(inspect(parser('>>> a\n>> b\n> c')), [['<blockquote><blockquote><blockquote>a</blockquote>b</blockquote>c</blockquote>'], '']);
    });

  });

});
