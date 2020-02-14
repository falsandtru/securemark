import { emphasis } from './emphasis';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/emphasis', () => {
  describe('emphasis', () => {
    const parser = (source: string) => some(emphasis)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('*')), undefined);
      assert.deepStrictEqual(inspect(parser('*a')), [['*', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b')), [['*', 'a', '**', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('* *')), undefined);
      assert.deepStrictEqual(inspect(parser('* a*')), undefined);
      assert.deepStrictEqual(inspect(parser('* a *')), undefined);
      assert.deepStrictEqual(inspect(parser('*\n*')), undefined);
      assert.deepStrictEqual(inspect(parser('*\na*')), undefined);
      assert.deepStrictEqual(inspect(parser('*\\ a*')), undefined);
      assert.deepStrictEqual(inspect(parser('*\\\na*')), undefined);
      assert.deepStrictEqual(inspect(parser('*<wbr>a*')), undefined);
      assert.deepStrictEqual(inspect(parser('*<# a #>a*')), undefined);
      assert.deepStrictEqual(inspect(parser('**a**')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('*a*')), [['<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a *')), [['<em>a </em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\n*')), [['<em>a<br></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\\\n*')), [['<em>a<span class="linebreak"> </span></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*ab*')), [['<em>ab</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\nb*')), [['<em>a<br>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\\\nb*')), [['<em>a<span class="linebreak"> </span>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**')), [['<em>a</em>'], '*']);
      assert.deepStrictEqual(inspect(parser('*a**b*')), [['<em>a**b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b**c*')), [['<em>a<strong>b</strong>c</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a***')), [['<em><strong>a</strong></em>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('*`a`*')), [['<em><code data-src="`a`">a</code></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*<small>*')), [['<em>&lt;small&gt;</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*(*a*)*')), [['<em>(<em>a</em>)</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*(**a**)*')), [['<em>(<strong>a</strong>)</em>'], '']);
    });

  });

});
