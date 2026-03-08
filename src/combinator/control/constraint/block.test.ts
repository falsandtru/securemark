import { block } from './block';
import { List, Node, input } from '../../data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/block', () => {
  describe('block', () => {
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.throws(() => block(_ => new List<Node<string>>())(input(' \n', ctx)));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(block(({ context }) => { context.position = context.source.length; return new List<Node<string>>(); })(input('\n', ctx)), ctx), [[], '']);
      assert.deepStrictEqual(inspect(block(({ context }) => { context.position = context.source.length; return new List<Node<string>>(); })(input(' \n', ctx)), ctx), [[], '']);
      assert.deepStrictEqual(inspect(block(({ context }) => { context.position = context.source.length; return new List<Node<string>>(); })(input('\n\n', ctx)), ctx), [[], '']);
      assert.deepStrictEqual(inspect(block(({ context }) => { context.position = context.source.length - 1; return new List<Node<string>>(); })(input('\n\n', ctx)), ctx), [[], '\n']);
    });

  });

});
