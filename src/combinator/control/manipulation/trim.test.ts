import { trim } from './trim';
import { input } from '../../data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/trim', () => {
  describe('trim', () => {
    const { context: ctx } = input('', {});

    it('', () => {
      const parser = trim(({ context }) => { context.position = context.source.length; return [[context.source]]; });
      assert.deepStrictEqual(inspect(parser(input('', ctx)), ctx), undefined);
      assert.deepStrictEqual(inspect(parser(input('a', ctx)), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input('a\n', ctx)), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input('a ', ctx)), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input('a \n', ctx)), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input(' a', ctx)), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input(' a ', ctx)), ctx), [['a'], '']);
      assert.deepStrictEqual(inspect(parser(input(' a \n b \n', ctx)), ctx), [['a \n b'], '']);
    });

  });

});
