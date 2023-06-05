import { emphasis } from './emphasis';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/emphasis', () => {
  describe('emphasis', () => {
    const parser = (source: string) => some(emphasis)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('*')), undefined);
      assert.deepStrictEqual(inspect(parser('*a')), [['*', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('*a *')), [['*', 'a'], ' *']);
      assert.deepStrictEqual(inspect(parser('*a  *')), [['*', 'a', ' '], ' *']);
      assert.deepStrictEqual(inspect(parser('*a\n*')), [['*', 'a'], '\n*']);
      assert.deepStrictEqual(inspect(parser('*a\nb*')), [['*', 'a'], '\nb*']);
      assert.deepStrictEqual(inspect(parser('*a\\ *')), [['*', 'a'], '\\ *']);
      assert.deepStrictEqual(inspect(parser('*a\\\n*')), [['*', 'a'], '\\\n*']);
      assert.deepStrictEqual(inspect(parser('*a\\\nb*')), [['*', 'a'], '\\\nb*']);
      assert.deepStrictEqual(inspect(parser('*a**b')), [['*', 'a', '**', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b*')), [['*', 'a', '**', 'b', '*'], '']);
      assert.deepStrictEqual(inspect(parser('* *')), undefined);
      assert.deepStrictEqual(inspect(parser('* a*')), undefined);
      assert.deepStrictEqual(inspect(parser('* a *')), undefined);
      assert.deepStrictEqual(inspect(parser('*\n*')), undefined);
      assert.deepStrictEqual(inspect(parser('*\na*')), undefined);
      assert.deepStrictEqual(inspect(parser('*\\ a*')), undefined);
      assert.deepStrictEqual(inspect(parser('*\\\na*')), undefined);
      assert.deepStrictEqual(inspect(parser('*<wbr>a*')), undefined);
      assert.deepStrictEqual(inspect(parser('**a**')), undefined);
      assert.deepStrictEqual(inspect(parser('***a***')), undefined);
      assert.deepStrictEqual(inspect(parser(' *a*')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('*a*')), [['<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*ab*')), [['<em>ab</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**')), [['<em>a</em>'], '*']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('*a *b**')), [['<em>a <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a **b***')), [['<em>a <strong>b</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\\ *b**')), [['<em>a <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a&Tab;*b**')), [['<em>a\t<em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a<wbr>*b**')), [['<em>a<wbr><em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b**c*')), [['<em>a<strong>b</strong>c</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b**c*d')), [['<em>a<strong>b</strong>c</em>'], 'd']);
      assert.deepStrictEqual(inspect(parser('*`a`*')), [['<em><code data-src="`a`">a</code></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*(*a*)*')), [['<em><span class="paren">(<em>a</em>)</span></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*(**a**)*')), [['<em><span class="paren">(<strong>a</strong>)</span></em>'], '']);
    });

  });

});
