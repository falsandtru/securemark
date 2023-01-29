import { emphasis } from './emphasis';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/emphasis', () => {
  describe('emphasis', () => {
    const parser = (source: string) => some(emphasis)({ source, context: {} });

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('_')), undefined);
      assert.deepStrictEqual(inspect(parser('_a')), [['_', 'a'], '']);
      assert.deepStrictEqual(inspect(parser('_a _')), [['_', 'a'], ' _']);
      assert.deepStrictEqual(inspect(parser('_a  _')), [['_', 'a', ' '], ' _']);
      assert.deepStrictEqual(inspect(parser('_a\n_')), [['_', 'a'], '\n_']);
      assert.deepStrictEqual(inspect(parser('_a\nb_')), [['_', 'a'], '\nb_']);
      assert.deepStrictEqual(inspect(parser('_a\\ _')), [['_', 'a'], '\\ _']);
      assert.deepStrictEqual(inspect(parser('_a\\\n_')), [['_', 'a'], '\\\n_']);
      assert.deepStrictEqual(inspect(parser('_a\\\nb_')), [['_', 'a'], '\\\nb_']);
      assert.deepStrictEqual(inspect(parser('_ _')), undefined);
      assert.deepStrictEqual(inspect(parser('_ a_')), undefined);
      assert.deepStrictEqual(inspect(parser('_ a _')), undefined);
      assert.deepStrictEqual(inspect(parser('_\n_')), undefined);
      assert.deepStrictEqual(inspect(parser('_\na_')), undefined);
      assert.deepStrictEqual(inspect(parser('_\\ a_')), undefined);
      assert.deepStrictEqual(inspect(parser('_\\\na_')), undefined);
      assert.deepStrictEqual(inspect(parser('_<wbr>a_')), undefined);
      assert.deepStrictEqual(inspect(parser(' _a_')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('_a_')), [['<em>a</em>'], '']);
      assert.deepStrictEqual(inspect(parser('_ab_')), [['<em>ab</em>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('_a _b__')), [['<em>a <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('_a *b*_')), [['<em>a <strong>b</strong></em>'], '']);
      assert.deepStrictEqual(inspect(parser('_a\\ _b__')), [['<em>a <em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('_a&Tab;_b__')), [['<em>a\t<em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('_a<wbr>_b__')), [['<em>a<wbr><em>b</em></em>'], '']);
      assert.deepStrictEqual(inspect(parser('_(_a_)_')), [['<em><span class="paren">(<em>a</em>)</span></em>'], '']);
    });

  });

});
