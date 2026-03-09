import { List, Node, Context, input } from '../../data/parser';
import { line } from './line';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/line', () => {
  describe('line', () => {
    it('invalid', () => {
      assert.deepStrictEqual(inspect(line(_ => new List<Node<string>>()), input('', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(line(({ context }) => { context.position = context.source.length; return new List<Node<string>>(); }), input(' ', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(line(({ context }) => { context.position = context.source.length; return new List<Node<string>>(); }), input('\n', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(line(({ context }) => { context.position = context.source.length; return new List<Node<string>>(); }), input('\n\n', new Context())), [[], '\n']);
      assert.deepStrictEqual(inspect(line(({ context }) => { context.position = context.source.length; return new List<Node<string>>(); }), input(' \n', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(line(({ context }) => { context.position = context.source.length - 1; return new List<Node<string>>(); }), input(' \n', new Context())), [[], '']);
    });

  });

});
