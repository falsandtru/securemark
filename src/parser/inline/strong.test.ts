import { strong } from './strong';
import { some } from '../../combinator';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/strong', () => {
  describe('strong', () => {
    const parser = some(strong);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('**')), undefined);
      assert.deepStrictEqual(inspect(parser, input('**a')), [['**', 'a'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a **')), [['**', 'a ', '**'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a  **')), [['**', 'a', ' ', '**'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a\n**')), [['**', 'a', '<br>', '**'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a\\ **')), [['**', 'a', ' ', '**'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a\\\n**')), [['**', 'a', '<br>', '**'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a*')), [['**', 'a'], '*']);
      assert.deepStrictEqual(inspect(parser, input('**a*b**')), [['**', 'a', '<em>b</em>'], '*']);
      assert.deepStrictEqual(inspect(parser, input('** **')), undefined);
      assert.deepStrictEqual(inspect(parser, input('** a**')), undefined);
      assert.deepStrictEqual(inspect(parser, input('** a **')), undefined);
      assert.deepStrictEqual(inspect(parser, input('**\n**')), undefined);
      assert.deepStrictEqual(inspect(parser, input('**\na**')), undefined);
      assert.deepStrictEqual(inspect(parser, input('**\\ a**')), undefined);
      assert.deepStrictEqual(inspect(parser, input('**\\\na**')), undefined);
      assert.deepStrictEqual(inspect(parser, input('**<wbr>a**')), undefined);
      assert.deepStrictEqual(inspect(parser, input('***a***')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' **a**')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('**a**')), [['<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**ab**')), [['<strong>ab</strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a\nb**')), [['<strong>a<br>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a\\\nb**')), [['<strong>a<br>b</strong>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('**a *b***')), [['<strong>a <em>b</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**- *b***')), [['<strong>- <em>b</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a **b****')), [['<strong>a <strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a&Tab;**b****')), [['<strong>a\t<strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a<wbr>**b****')), [['<strong>a<wbr><strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a*b*')), [['**', 'a', '<em>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a*b*c')), [['**', 'a', '<em>b</em>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a*b*c**')), [['<strong>a<em>b</em>c</strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**a*b*c**d')), [['<strong>a<em>b</em>c</strong>'], 'd']);
      assert.deepStrictEqual(inspect(parser, input('**`a`**')), [['<strong><code data-src="`a`">a</code></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**(*a*)**')), [['<strong><span class="paren">(<em>a</em>)</span></strong>'], '']);
      assert.deepStrictEqual(inspect(parser, input('**(**a**)**')), [['<strong><span class="paren">(<strong>a</strong>)</span></strong>'], '']);
    });

  });

});
