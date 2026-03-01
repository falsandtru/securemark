import { List, Data, input } from '../../data/parser';
import { line } from './line';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/line', () => {
  describe('line', () => {
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(line(_ => [new List<Data<string>>()])(input('', ctx)), ctx), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(line(({ context }) => { context.position = context.source.length; return [new List<Data<string>>()]; })(input(' ', ctx)), ctx), [[], '']);
      assert.deepStrictEqual(inspect(line(({ context }) => { context.position = context.source.length; return [new List<Data<string>>()]; })(input('\n', ctx)), ctx), [[], '']);
      assert.deepStrictEqual(inspect(line(({ context }) => { context.position = context.source.length; return [new List<Data<string>>()]; })(input('\n\n', ctx)), ctx), [[], '\n']);
      assert.deepStrictEqual(inspect(line(({ context }) => { context.position = context.source.length; return [new List<Data<string>>()]; })(input(' \n', ctx)), ctx), [[], '']);
      assert.deepStrictEqual(inspect(line(({ context }) => { context.position = context.source.length - 1; return [new List<Data<string>>()]; })(input(' \n', ctx)), ctx), [[], '']);
    });

  });

});
