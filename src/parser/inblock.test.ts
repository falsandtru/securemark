﻿import { inblock } from './inblock';
import { some } from '../combinator';
import { inspect } from '../debug.test';

describe('Unit: parser/inblock', () => {
  describe('inblock', () => {
    const parser = some(inblock);

    it('annotation', () => {
      assert.deepStrictEqual(inspect(parser('((a))')), [['<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('a((b))')), [['a', '<sup class="annotation">b</sup>'], '']);
    });

    it('authority', () => {
      assert.deepStrictEqual(inspect(parser('[[a]]')), [['<sup class="authority">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('a[[b]]')), [['a', '<sup class="authority">b</sup>'], '']);
    });

    it('channel', () => {
      assert.deepStrictEqual(inspect(parser('@a#1')), [['<a class="channel" rel="noopener">@a#1</a>'], '']);
      assert.deepStrictEqual(inspect(parser(' @a#1')), [[' ', '<a class="channel" rel="noopener">@a#1</a>'], '']);
    });

    it('account', () => {
      assert.deepStrictEqual(inspect(parser('@a')), [['<a class="account" rel="noopener">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('@a@')), [['@', 'a@'], '']);
      assert.deepStrictEqual(inspect(parser('@a@b')), [['@', 'a@', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('@a,@b')), [['<a class="account" rel="noopener">@a</a>', ',', '<a class="account" rel="noopener">@b</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a@b')), [['a@', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('a@@b')), [['a@@', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('_@a')), [['_', '<a class="account" rel="noopener">@a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('*@a*')), [['<em>@a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('(@a)')), [['(@a)'], '']);
      assert.deepStrictEqual(inspect(parser(' @a')), [[' ', '<a class="account" rel="noopener">@a</a>'], '']);
    });

    it('hashtag', () => {
      assert.deepStrictEqual(inspect(parser('#a#')), [['#', 'a', '#'], '']);
      assert.deepStrictEqual(inspect(parser('#a#b')), [['#', 'a', '#', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('#a')), [['<a class="hashtag" rel="noopener">#a</a>'], '']);
      assert.deepStrictEqual(inspect(parser('#a\nb\n#c\n[#d]')), [['<a class="hashtag" rel="noopener">#a</a>', '<span class="linebreak"> </span>', 'b', '<span class="linebreak"> </span>', '<a class="hashtag" rel="noopener">#c</a>', '<span class="linebreak"> </span>', '<a href="#index:d" rel="noopener">d</a>'], '']);
      assert.deepStrictEqual(inspect(parser('a#b')), [['a', '#', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('((a))#b')), [['<sup class="annotation">a</sup>', '#', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[[a]]#b')), [['<sup class="authority">a</sup>', '#', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('[#a')), [['[', '#', 'a'], '']);
      assert.deepStrictEqual(inspect(parser(' [#a')), [[' ', '[', '#', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('|#a')), [['|', '#', 'a'], '']);
      assert.deepStrictEqual(inspect(parser(' #a')), [[' ', '<a class="hashtag" rel="noopener">#a</a>'], '']);
    });

  });

});
