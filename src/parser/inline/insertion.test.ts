﻿import { insertion } from './insertion';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/insertion', () => {
  describe('insertion', () => {
    const parser = some(insertion);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('+')), undefined);
      assert.deepStrictEqual(inspect(parser('++')), undefined);
      assert.deepStrictEqual(inspect(parser('+++')), undefined);
      assert.deepStrictEqual(inspect(parser('++++')), undefined);
      assert.deepStrictEqual(inspect(parser('+++++')), undefined);
      assert.deepStrictEqual(inspect(parser('a++a++')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('++a++')), [['<ins>a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a+++')), [['<ins>a</ins>'], '+']);
      assert.deepStrictEqual(inspect(parser('++a ++')), [['<ins>a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ a++')), [['<ins> a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ a ++')), [['<ins> a </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ ++')), [['<ins> </ins>'], '']);
      assert.deepStrictEqual(inspect(parser('+++a++')), [['<ins>+a</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('+++a+++')), [['<ins>+a</ins>'], '+']);
      assert.deepStrictEqual(inspect(parser('++a++b++++')), [['<ins>a<ins>b</ins></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++++a++b++')), [['<ins><ins>a</ins>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++\n++')), [['<ins><span class="linebreak"> </span></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++\\\n++')), [['<ins><br></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++<wbr>++')), [['<ins><wbr></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++ab++')), [['<ins>ab</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\nb++')), [['<ins>a<span class="linebreak"> </span>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++a\\\nb++')), [['<ins>a<br>b</ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++\\+++')), [['<ins>+</ins>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('++<a>++')), [['<ins><span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;a&gt;</span></ins>'], '']);
      assert.deepStrictEqual(inspect(parser('++`a`++')), [['<ins><code data-src="`a`">a</code></ins>'], '']);
    });

  });

});
