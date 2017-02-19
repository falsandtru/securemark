import { loop } from '../../combinator/loop';
import { newline } from './newline';
import { inspect } from '../debug.test';

describe('Unit: parser/newline', () => {
  describe('newline', () => {
    it('invalid', () => {
      const parser = loop(newline);
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser(' ')), void 0);
      assert.deepStrictEqual(inspect(parser('a')), void 0);
    });

    it('valid', () => {
      const parser = loop(newline);
      assert.deepStrictEqual(inspect(parser('\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\na')), [[], 'a']);
      assert.deepStrictEqual(inspect(parser('\n\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\n\na')), [[], 'a']);
      assert.deepStrictEqual(inspect(parser('\n\n\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\n\n\na')), [[], 'a']);
    });

  });

});
