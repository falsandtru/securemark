import { indent } from './indent';
import { input } from '../../data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/indent', () => {
  describe('indent', () => {
    const { context: ctx } = input('', {});

    it('valid', () => {
      const parser = indent(({ context }) => { context.position = context.source.length; return [[context.source]]; });
      assert.deepStrictEqual(inspect(parser(input('', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input(' ', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('  ', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('a ', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input(' a\n', ctx)), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input(' a ', ctx)), ctx), [['a '], '']);
      assert.deepStrictEqual(inspect(parser(input(' a \n', ctx)), ctx), [['a '], '']);
      assert.deepStrictEqual(inspect(parser(input('  a', ctx)), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input(' a\n a', ctx)), ctx), [['a\na'], '']);
      assert.deepStrictEqual(inspect(parser(input(' a\n  a', ctx)), ctx), [['a\n a'], '']);
      assert.deepStrictEqual(inspect(parser(input('  a\n a', ctx)), ctx), [['a'], ' a']);
      assert.deepStrictEqual(inspect(parser(input(' \ta', ctx)), ctx), [['\ta'], '']);
      assert.deepStrictEqual(inspect(parser(input('\ta', ctx)), ctx), [['a'], '']);
    });

  });

});
