import { contentline } from './line';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/line', () => {
  describe('contentline', () => {
    const parser = (source: string) => contentline(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' '), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(' \n'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('\n\n'), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('a'), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser('a '), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a'), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a '), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a\n'), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a \n'), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser('ab'), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser('a\nb'), ctx), [[], 'b']);
      assert.deepStrictEqual(inspect(parser('\\\n'), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser('\\ \\\n'), ctx), [[], '']);
      assert.deepStrictEqual(inspect(parser('\\ \\ \\\n'), ctx), [[], '']);
    });

  });

});
