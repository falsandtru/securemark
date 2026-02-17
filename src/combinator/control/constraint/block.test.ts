import { block } from './block';
import { input } from '../../data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/block', () => {
  describe('block', () => {
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.throws(() => block(_ => [[]])(input(' \n', ctx)));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(block(({ context }) => { context.position = context.source.length; return [[]]; })(input('\n', ctx)), ctx), [[], '']);
      assert.deepStrictEqual(inspect(block(({ context }) => { context.position = context.source.length; return [[]]; })(input(' \n', ctx)), ctx), [[], '']);
      assert.deepStrictEqual(inspect(block(({ context }) => { context.position = context.source.length; return [[]]; })(input('\n\n', ctx)), ctx), [[], '']);
      assert.deepStrictEqual(inspect(block(({ context }) => { context.position = context.source.length - 1; return [[]]; })(input('\n\n', ctx)), ctx), [[], '\n']);
    });

  });

});
