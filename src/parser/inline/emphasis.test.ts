import { emphasis } from './emphasis';
import { loop } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/emphasis', () => {
  describe('emphasis', () => {
    const parser = loop(emphasis);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('*')), undefined);
      assert.deepStrictEqual(inspect(parser('**')), undefined);
      assert.deepStrictEqual(inspect(parser('* *')), undefined);
      assert.deepStrictEqual(inspect(parser('*\n*')), undefined);
      assert.deepStrictEqual(inspect(parser('*<wbr>*')), undefined);
      assert.deepStrictEqual(inspect(parser('**a**')), undefined);
      assert.deepStrictEqual(inspect(parser('a*a*')), undefined);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('*a*')), [['<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*ab*')), [['<em>ab</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\nb*')), [['<em>a<span class="newline"> </span>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a\\\nb*')), [['<em>a<br>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**')), [['<em>a</em>'], '*']);
      assert.deepStrictEqual(inspect(parser('*a**b*')), [['<em>a</em>', '<em>b</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*a**b**c*')), [['<em>a<strong>b</strong>c</em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a****b***')), [['<em><strong>a</strong><strong>b</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('***a**b**c***')), [['<em><strong>a</strong>b<strong>c</strong></em>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('*<ruby>*')), [['<em>&lt;ruby&gt;</em>'], '']);
      assert.deepStrictEqual(inspect(parser('*`<ruby>`*')), [['<em><code data-src="`<ruby>`">&lt;ruby&gt;</code></em>'], '']);
      assert.deepStrictEqual(inspect(parser('*`a`*')), [['<em><code data-src="`a`">a</code></em>'], '']);
    });

  });

});
