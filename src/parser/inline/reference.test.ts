import { reference } from './reference';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/reference', () => {
  describe('reference', () => {
    const parser = some(reference);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('(')), undefined);
      assert.deepStrictEqual(inspect(parser('[[')), undefined);
      assert.deepStrictEqual(inspect(parser('[]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[]]')), undefined);
      assert.deepStrictEqual(inspect(parser('[[]]]')), undefined);
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
      assert.deepStrictEqual(inspect(parser('a[[b]]')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('[[a]]')), [['<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a ]]')), [['<sup class="reference">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[ab]]')), [['<sup class="reference">ab</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[a b]]')), [['<sup class="reference">a b</sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('[["]]')), [['<sup class="reference">"</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[<a>]]')), [['<sup class="reference"><span class="invalid" data-invalid-syntax="html" data-invalid-type="syntax">&lt;a&gt;</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[`a`]]')), [['<sup class="reference"><code data-src="`a`">a</code></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[[a]]]')), [['<sup class="reference">[a]</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('[[@a]]')), [['<sup class="reference"><a class="account" rel="noopener">@a</a></sup>'], '']);
    });

  });

});
