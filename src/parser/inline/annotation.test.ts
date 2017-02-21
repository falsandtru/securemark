import { loop } from '../../combinator/loop';
import { annotation } from './annotation';
import { inspect } from '../debug.test';

describe('Unit: parser/annotation', () => {
  describe('annotation', () => {
    const parser = loop(annotation);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('(')), void 0);
      assert.deepStrictEqual(inspect(parser('((')), void 0);
      assert.deepStrictEqual(inspect(parser('()')), void 0);
      assert.deepStrictEqual(inspect(parser('(())')), void 0);
      assert.deepStrictEqual(inspect(parser('((\\))')), void 0);
      assert.deepStrictEqual(inspect(parser('a((a))')), void 0);
    });

    it('ab', () => {
      assert.deepStrictEqual(inspect(parser('((a))')), [['<sup class="annotation" title="a">*</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((ab))')), [['<sup class="annotation" title="ab">*</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((a\nb))')), [['<sup class="annotation" title="ab">*</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('(( ))')), [['<sup class="annotation" title="">*</sup>'], '']);
      assert.deepStrictEqual(inspect(parser('((\n))')), [['<sup class="annotation" title="">*</sup>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('(("))')), [['<sup class="annotation" title="&quot;">*</sup>'], '']);
    });

  });

});
