import { emphasis } from './emphasis';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/emphasis', () => {
  describe('emphasis', () => {
    const parser = some(emphasis);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('*')), undefined);
      assert.deepStrictEqual(inspect(parser, input('*a')), [['*', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a *')), [['*', 'a ', '*'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a  *')), [['*', 'a', ' ', '*'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a\n*')), [['*', 'a', '<br>', '*'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a\\ *')), [['*', 'a', ' ', '*'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a\\\n*')), [['*', 'a', '<br>', '*'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**b')), [['*', 'a', '**', 'b'], '']);
      assert.deepStrictEqual(inspect(parser, input('* *')), undefined);
      assert.deepStrictEqual(inspect(parser, input('* a*')), undefined);
      assert.deepStrictEqual(inspect(parser, input('* a *')), undefined);
      assert.deepStrictEqual(inspect(parser, input('*\n*')), undefined);
      assert.deepStrictEqual(inspect(parser, input('*\na*')), undefined);
      assert.deepStrictEqual(inspect(parser, input('*\\ a*')), undefined);
      assert.deepStrictEqual(inspect(parser, input('*\\\na*')), undefined);
      assert.deepStrictEqual(inspect(parser, input('*<wbr>a*')), undefined);
      assert.deepStrictEqual(inspect(parser, input('**a**')), undefined);
      assert.deepStrictEqual(inspect(parser, input('***a***')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' *a*')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('*a*')), [['<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*ab*')), [['<em>ab</em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**')), [['<em>a</em>'], '*']);
      assert.deepStrictEqual(inspect(parser, input('*a\nb*')), [['<em>a<br>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a\\\nb*')), [['<em>a<br>b</em>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('*a *b**')), [['<em>a <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*- *b**')), [['<em>- <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a **b***')), [['<em>a <strong>b</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a\\ *b**')), [['<em>a <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a&Tab;*b**')), [['<em>a\t<em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a<wbr>*b**')), [['<em>a<wbr><em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**b*')), [['<em>a**b</em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**b**')), [[ '*', 'a', '<strong>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**b**c')), [['*', 'a', '<strong>b</strong>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**b**c*')), [['<em>a<strong>b</strong>c</em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*a**b**c*d')), [['<em>a<strong>b</strong>c</em>'], 'd']);
      assert.deepStrictEqual(inspect(parser, input('*`a`*')), [['<em><code data-src="`a`">a</code></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*(*a*)*')), [['<em><span class="paren">(<em>a</em>)</span></em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('*(**a**)*')), [['<em><span class="paren">(<strong>a</strong>)</span></em>'], '']);
    });

  });

});
