import { annotation } from './annotation';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/annotation', () => {
  describe('annotation', () => {
    const parser = (source: string) => some(annotation)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('('), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('()'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('(('), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('(())'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('(()))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('(("))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('(([))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('((<bdi>))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('(( ))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('(( (a'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('((\n))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('((\na))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('((\\\na))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('((a\n))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('((a\\\n))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('((a\nb))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('((a\\\nb))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('((*a\nb*))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('((\\))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('((a)b))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('(((a))'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' ((a))'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('(( a))'), ctx), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(( a ))'), ctx), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((\\ a))'), ctx), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((<wbr>a))'), ctx), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a))'), ctx), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a ))'), ctx), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a  ))'), ctx), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a &nbsp;))'), ctx), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a <wbr>))'), ctx), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((ab))'), ctx), [['<sup class="annotation"><span>ab</span></sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('((`a`))'), ctx), [['<sup class="annotation"><span><code data-src="`a`">a</code></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((@a))'), ctx), [['<sup class="annotation"><span><a class="account" href="/@a">@a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((http://host))'), ctx), [['<sup class="annotation"><span><a class="url" href="http://host" target="_blank">http://host</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((![]{a}))'), ctx), [['<sup class="annotation"><span>!<a class="url" href="a">a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(([[a] ]))'), ctx), [['<sup class="annotation"><span>[[a] ]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(((a)))'), ctx), [['<sup class="annotation"><span>(a)</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((((a))))'), ctx), [['<sup class="annotation"><span><span class="paren">((a))</span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(([[a]]))'), ctx), [['<sup class="annotation"><span><sup class="reference"><span>a</span></sup></span></sup>'], '']);
    });

  });

});
