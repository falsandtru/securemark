import { annotation } from './annotation';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/annotation', () => {
  describe('annotation', () => {
    const parser = (source: string) => some(annotation)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('(')), undefined);
      assert.deepStrictEqual(inspect(parser('()')), undefined);
      assert.deepStrictEqual(inspect(parser('((')), undefined);
      assert.deepStrictEqual(inspect(parser('(())')), undefined);
      assert.deepStrictEqual(inspect(parser('(()))')), undefined);
      assert.deepStrictEqual(inspect(parser('(( ))')), undefined);
      assert.deepStrictEqual(inspect(parser('(( (a')), undefined);
      assert.deepStrictEqual(inspect(parser('((\n))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\na))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\\\na))')), undefined);
      assert.deepStrictEqual(inspect(parser('((a\n))')), undefined);
      assert.deepStrictEqual(inspect(parser('((a\\\n))')), undefined);
      assert.deepStrictEqual(inspect(parser('((a\nb))')), undefined);
      assert.deepStrictEqual(inspect(parser('((a\\\nb))')), undefined);
      assert.deepStrictEqual(inspect(parser('((*a\nb*))')), undefined);
      assert.deepStrictEqual(inspect(parser('((\\))')), undefined);
      assert.deepStrictEqual(inspect(parser('((a)b))')), undefined);
      assert.deepStrictEqual(inspect(parser('(((a))')), undefined);
      assert.deepStrictEqual(inspect(parser(' ((a))')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('(( a))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(( a ))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((\\ a))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((<wbr>a))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a ))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a  ))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a &nbsp;))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a <wbr>))')), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((ab))')), [['<sup class="annotation"><span>ab</span></sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('((<bdi>))')), [['<sup class="annotation"><span><span class="invalid">&lt;bdi&gt;</span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((`a`))')), [['<sup class="annotation"><span><code data-src="`a`">a</code></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((@a))')), [['<sup class="annotation"><span><a href="/@a" class="account">@a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((http://host))')), [['<sup class="annotation"><span><a href="http://host" target="_blank">http://host</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((![]{a}))')), [['<sup class="annotation"><span>!<a href="a">a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(((a)))')), [['<sup class="annotation"><span>(a)</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((((a))))')), [['<sup class="annotation"><span><span class="paren">((a))</span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(([[a]]))')), [['<sup class="annotation"><span><sup class="reference"><span>a</span></sup></span></sup>'], '']);
    });

  });

});
