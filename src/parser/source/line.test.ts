import { contentline } from './line';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/line', () => {
  describe('contentline', () => {
    const parser = (source: string) => contentline(input(source, {}));

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser(' ')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser(' \n')), undefined);
      assert.deepStrictEqual(inspect(parser('\n\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('a')), [[], '']);
      assert.deepStrictEqual(inspect(parser('a ')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a ')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a \n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [[], '']);
      assert.deepStrictEqual(inspect(parser('a\nb')), [[], 'b']);
      assert.deepStrictEqual(inspect(parser('\\\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\\ \\\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\\ \\ \\\n')), [[], '']);
    });

  });

});
