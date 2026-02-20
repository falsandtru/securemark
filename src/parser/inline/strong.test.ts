import { strong } from './strong';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/strong', () => {
  describe('strong', () => {
    const parser = (source: string) => some(strong)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('**'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('**a'), ctx), [['**', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('**a **'), ctx), [['**', 'a', ' ', '**'], '']);
      assert.deepStrictEqual(inspect(parser('**a  **'), ctx), [['**', 'a', ' ', ' ', '**'], '']);
      assert.deepStrictEqual(inspect(parser('**a\n**'), ctx), [['**', 'a', '<br>', '**'], '']);
      assert.deepStrictEqual(inspect(parser('**a\\ **'), ctx), [['**', 'a', ' ', '**'], '']);
      assert.deepStrictEqual(inspect(parser('**a\\\n**'), ctx), [['**', 'a', '<br>', '**'], '']);
      assert.deepStrictEqual(inspect(parser('**a*'), ctx), [['**', 'a'], '*']);
      assert.deepStrictEqual(inspect(parser('**a*b**'), ctx), [['**', 'a', '<em>b</em>'], '*']);
      assert.deepStrictEqual(inspect(parser('** **'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('** a**'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('** a **'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('**\n**'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('**\na**'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('**\\ a**'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('**\\\na**'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('**<wbr>a**'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('***a***'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' **a**'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('**a**'), ctx), [['<strong>a</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**ab**'), ctx), [['<strong>ab</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\nb**'), ctx), [['<strong>a<br>b</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a\\\nb**'), ctx), [['<strong>a<br>b</strong>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('**a *b***'), ctx), [['<strong>a <em>b</em></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a **b****'), ctx), [['<strong>a <strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a&Tab;**b****'), ctx), [['<strong>a\t<strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a<wbr>**b****'), ctx), [['<strong>a<wbr><strong>b</strong></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b*'), ctx), [['**', 'a', '<em>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b*c'), ctx), [['**', 'a', '<em>b</em>', 'c'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b*c**'), ctx), [['<strong>a<em>b</em>c</strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**a*b*c**d'), ctx), [['<strong>a<em>b</em>c</strong>'], 'd']);
      assert.deepStrictEqual(inspect(parser('**`a`**'), ctx), [['<strong><code data-src="`a`">a</code></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**(*a*)**'), ctx), [['<strong><span class="paren">(<em>a</em>)</span></strong>'], '']);
      assert.deepStrictEqual(inspect(parser('**(**a**)**'), ctx), [['<strong><span class="paren">(<strong>a</strong>)</span></strong>'], '']);
    });

  });

});
