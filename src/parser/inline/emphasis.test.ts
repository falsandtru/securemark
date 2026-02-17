import { emphasis } from './emphasis';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/emphasis', () => {
  describe('emphasis', () => {
    const parser = (source: string) => some(emphasis)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('*'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('*a'), ctx), [['*', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('*a *'), ctx), [['*', 'a'], ' *']);
      assert.deepStrictEqual(inspect(parser('*a  *'), ctx), [['*', 'a', ' '], ' *']);
      assert.deepStrictEqual(inspect(parser('*a\n*'), ctx), [['*', 'a'], '\n*']);
      assert.deepStrictEqual(inspect(parser('*a\\ *'), ctx), [['*', 'a'], '\\ *']);
      assert.deepStrictEqual(inspect(parser('*a\\\n*'), ctx), [['*', 'a'], '\\\n*']);
      assert.deepStrictEqual(inspect(parser('*a**b'), ctx), [['*', 'a', '**', 'b'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b*'), ctx), [['*', 'a', '**', 'b', '*'], '']);
      assert.deepStrictEqual(inspect(parser('* *'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('* a*'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('* a *'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('*\n*'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('*\na*'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('*\\ a*'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('*\\\na*'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('*<wbr>a*'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('**a**'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('***a***'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' *a*'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('*a*'), ctx), [['<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*ab*'), ctx), [['<em>ab</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**'), ctx), [['<em>a</em>'], '*']);
      assert.deepStrictEqual(inspect(parser('*a\nb*'), ctx), [['<em>a<br>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\\\nb*'), ctx), [['<em>a<br>b</em>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('*a *b**'), ctx), [['<em>a <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a **b***'), ctx), [['<em>a <strong>b</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\\ *b**'), ctx), [['<em>a <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a&Tab;*b**'), ctx), [['<em>a\t<em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a<wbr>*b**'), ctx), [['<em>a<wbr><em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b**c*'), ctx), [['<em>a<strong>b</strong>c</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b**c*d'), ctx), [['<em>a<strong>b</strong>c</em>'], 'd']);
      assert.deepStrictEqual(inspect(parser('*`a`*'), ctx), [['<em><code data-src="`a`">a</code></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*(*a*)*'), ctx), [['<em><span class="paren">(<em>a</em>)</span></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*(**a**)*'), ctx), [['<em><span class="paren">(<strong>a</strong>)</span></em>'], '']);
    });

  });

});
