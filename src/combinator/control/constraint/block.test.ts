import { block } from './block';
import { List, Node, Context, input } from '../../data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/block', () => {
  describe('block', () => {
    it('invalid', () => {
      assert.throws(() => block(_ => new List<Node<string>>())(input(' \n', new Context())));
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(block(({ context }) => { context.position = context.source.length; return new List<Node<string>>(); }), input('\n', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(block(({ context }) => { context.position = context.source.length; return new List<Node<string>>(); }), input(' \n', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(block(({ context }) => { context.position = context.source.length; return new List<Node<string>>(); }), input('\n\n', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(block(({ context }) => { context.position = context.source.length - 1; return new List<Node<string>>(); }), input('\n\n', new Context())), [[], '\n']);
    });

  });

});
