import { emoji } from './emoji';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/emoji', () => {
  describe('emoji', () => {
    const parser = some(emoji);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser(':')), undefined);
      assert.deepStrictEqual(inspect(parser('::')), undefined);
      assert.deepStrictEqual(inspect(parser(':_:')), undefined);
      assert.deepStrictEqual(inspect(parser(':A:')), undefined);
      assert.deepStrictEqual(inspect(parser(':a__b:')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser(':smile:')), [['<span class="emoji" data-name="smile">:smile:</span>'], '']);
    });

  });

});
