import { annotation } from './annotation';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/annotation', () => {
  describe('annotation', () => {
    const parser = some(annotation);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('(', new Context())), [['<span class="paren">(</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('()', new Context())), [ [ '<span class="paren">()</span>' ], '' ]);
      assert.deepStrictEqual(inspect(parser, input('((', new Context())), [ [ '<span class="paren">(<span class="paren">(</span></span>' ], '' ]);
      assert.deepStrictEqual(inspect(parser, input('(())', new Context())), [['<span class="paren">(<span class="paren">()</span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(()))', new Context())), [['<span class="paren">(<span class="paren">()</span>)</span>'], ')']);
      assert.deepStrictEqual(inspect(parser, input('(("))', new Context())), [['<span class="paren">(<span class="paren">("))</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a', new Context())), [['<span class="paren">(<span class="paren">(a</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a)', new Context())), [['<span class="paren">(<span class="paren">(a)</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a)b)', new Context())), [['<span class="paren">(<span class="paren">(a)</span>b)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(([))', new Context())), [['<span class="paren">(<span class="paren">([))</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(([%))', new Context())), [['<span class="paren">(<span class="paren">([%))</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(( ))', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('(( a))', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('(( a ))', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('((\\ a))', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('((<wbr>a))', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('((\n))', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('((\na))', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('((\\\na))', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('((a\n))', new Context())), [['<span class="bracket">(<span class="bracket">(a<br>)</span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a\\\n))', new Context())), [['<span class="bracket">(<span class="bracket">(a<br>)</span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a\nb))', new Context())), [['<span class="bracket">(<span class="bracket">(a<br>b)</span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a\\\nb))', new Context())), [['<span class="bracket">(<span class="bracket">(a<br>b)</span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((*a\nb*))', new Context())), [['<span class="bracket">(<span class="bracket">(<em>a<br>b</em>)</span>)</span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((\\))', new Context())), [['<span class="paren">(<span class="paren">())</span></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(((a))', new Context())), [['<span class="paren">(<sup class="annotation"><span>a</span></sup></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((((a)))', new Context())), [['<span class="paren">(<sup class="annotation"><span><span class="paren">(a)</span></span></sup></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(((((a))))', new Context())), [['<span class="paren">(<sup class="annotation"><span><sup class="annotation"><span>a</span></sup></span></sup></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((((((a)))b)))', new Context())), [['<sup class="annotation"><span><span class="paren">(<sup class="annotation"><span><span class="paren">(a)</span></span></sup>b)</span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(((((((a)))b)))', new Context())), [['<span class="paren">(<sup class="annotation"><span><span class="paren">(<sup class="annotation"><span><span class="paren">(a)</span></span></sup>b)</span></span></sup></span>'], '']);
      assert.deepStrictEqual(inspect(parser, input(' ((a))', new Context())), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser, input('((a))', new Context())), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a ))', new Context())), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a  ))', new Context())), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a &nbsp;))', new Context())), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a <wbr>))', new Context())), [['<sup class="annotation"><span>a</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((ab))', new Context())), [['<sup class="annotation"><span>ab</span></sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser, input('((`a`))', new Context())), [['<sup class="annotation"><span><code data-src="`a`">a</code></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((@a))', new Context())), [['<sup class="annotation"><span><a class="account" href="/@a">@a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((http://host))', new Context())), [['<sup class="annotation"><span><a class="url" href="http://host" target="_blank">http://host</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((![]{a}))', new Context())), [['<sup class="annotation"><span>!<a class="url" href="a">a</a></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a(())))', new Context())), [['<sup class="annotation"><span>a<span class="paren">(<span class="paren">()</span>)</span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((a[[]]))', new Context())), [['<sup class="annotation"><span>a[[]]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(([[a] ]))', new Context())), [['<sup class="annotation"><span>[[a] ]</span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(((a)))', new Context())), [['<sup class="annotation"><span><span class="paren">(a)</span></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('((((a))))', new Context())), [['<sup class="annotation"><span><sup class="annotation"><span>a</span></sup></span></sup>'], '']);
      assert.deepStrictEqual(inspect(parser, input('(([[a]]))', new Context())), [['<sup class="annotation"><span><sup class="reference"><span>a</span></sup></span></sup>'], '']);
    });

  });

});
