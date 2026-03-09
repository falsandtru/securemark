import { strong } from './strong';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/strong', () => {
  describe('strong', () => {
    const parser = some(strong);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('**', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('**a', new Context())), [['**', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a **', new Context())), [['**', 'a', ' ', '**'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a  **', new Context())), [['**', 'a', ' ', '**'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a\n**', new Context())), [['**', 'a', '<br>', '**'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a\\ **', new Context())), [['**', 'a', ' ', '**'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a\\\n**', new Context())), [['**', 'a', '<br>', '**'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a*', new Context())), [['**', 'a'], '*']);
      assert.deepStrictEqual(inspect(parser, input('**a*b**', new Context())), [['**', 'a', '<em>b</em>'], '*']);
      assert.deepStrictEqual(inspect(parser, input('** **', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('** a**', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('** a **', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('**\n**', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('**\na**', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('**\\ a**', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('**\\\na**', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('**<wbr>a**', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('***a***', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' **a**', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('**a**', new Context())), [['<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**ab**', new Context())), [['<strong>ab</strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a\nb**', new Context())), [['<strong>a<br>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a\\\nb**', new Context())), [['<strong>a<br>b</strong>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('**a *b***', new Context())), [['<strong>a <em>b</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**- *b***', new Context())), [['<strong>- <em>b</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a **b****', new Context())), [['<strong>a <strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a&Tab;**b****', new Context())), [['<strong>a\t<strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a<wbr>**b****', new Context())), [['<strong>a<wbr><strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a*b*', new Context())), [['**', 'a', '<em>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a*b*c', new Context())), [['**', 'a', '<em>b</em>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a*b*c**', new Context())), [['<strong>a<em>b</em>c</strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a*b*c**d', new Context())), [['<strong>a<em>b</em>c</strong>'], 'd']);
      assert.deepStrictEqual(inspect(parser, input('**`a`**', new Context())), [['<strong><code data-src="`a`">a</code></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**(*a*)**', new Context())), [['<strong><span class="paren">(<em>a</em>)</span></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**(**a**)**', new Context())), [['<strong><span class="paren">(<strong>a</strong>)</span></strong>'], '']);
    });

  });

});
