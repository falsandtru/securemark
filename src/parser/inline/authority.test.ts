﻿import { authority } from './authority';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/authority', () => {
  describe('authority', () => {
    const parser = some(authority);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('(')), undefined);
      assert.deepStrictEqual(inspect(parser('[[')), undefined);
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[ ]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[ a]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[ a ]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[\n]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[\\]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[<wbr>]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\nb]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[a\\\nb]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[![]{a}]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[[[a]]]]')), undefined);
      assert.deepStrictEqual(inspect(parser('a[[a]]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[[a]]')), [['<sup class="authority">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[ab]]')), [['<sup class="authority">ab</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a ]]')), [['<sup class="authority">a </sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a b]]')), [['<sup class="authority">a b</sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('[["]]')), [['<sup class="authority">"</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[<a>]]')), [['<sup class="authority"><span class="invalid" data-invalid-type="html">&lt;a&gt;</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[`a`]]')), [['<sup class="authority"><code data-src="`a`">a</code></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]]]')), [['<sup class="authority">[a]</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[@a]]')), [['<sup class="authority"><a class="account" rel="noopener">@a</a></sup>'], '']);
    });

  });

});
