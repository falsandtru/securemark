import { loop } from '../../combinator/loop';
import { annotation } from './annotation';
import { inspect } from '../debug.test';

describe('Unit: parser/inline/annotation', () => {
  describe('annotation', () => {
    const parser = loop(annotation);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('(')), void 0);
      assert.deepStrictEqual(inspect(parser('((')), void 0);
      assert.deepStrictEqual(inspect(parser('()')), void 0);
      assert.deepStrictEqual(inspect(parser('(())')), void 0);
      assert.deepStrictEqual(inspect(parser('(( ))')), void 0);
      assert.deepStrictEqual(inspect(parser('((\n))')), void 0);
      assert.deepStrictEqual(inspect(parser('((\\))')), void 0);
      assert.deepStrictEqual(inspect(parser('((<wbr>))')), void 0);
      assert.deepStrictEqual(inspect(parser('a((a))')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('((a))')), [['<sup class="annotation">a</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((ab))')), [['<sup class="annotation">ab</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a\nb))')), [['<sup class="annotation">a b</sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('(("))')), [['<sup class="annotation">"</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(((a)))')), [['<sup class="annotation">(a)</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((<a>))')), [['<sup class="annotation">&lt;a&gt;</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((`a`))')), [['<sup class="annotation"><code data-src="`a`">a</code></sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(((a)))')), [['<sup class="annotation">(a)</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((((a))))')), [['<sup class="annotation"><sup class="annotation">a</sup></sup>'], '']);
    });

  });

});
