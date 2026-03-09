import { indent } from './indent';
import { List, Node, Context, input } from '../../data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: combinator/indent', () => {
  describe('indent', () => {
    it('valid', () => {
      const parser = indent(({ context }) => { context.position = context.source.length; return new List([new Node(context.source)]); });
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('  ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('a ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' a', new Context())), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input(' a ', new Context())), [['a '], '']);
      assert.deepStrictEqual(inspect(parser, input(' a\n', new Context())), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input(' a \n', new Context())), [['a '], '']);
      assert.deepStrictEqual(inspect(parser, input('  a', new Context())), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('   a', new Context())), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('    a', new Context())), [['a'], '']);
      assert.deepStrictEqual(inspect(parser, input('     a', new Context())), [[' a'], '']);
      assert.deepStrictEqual(inspect(parser, input(' a\n a', new Context())), [['a\na'], '']);
      assert.deepStrictEqual(inspect(parser, input(' a\n  a', new Context())), [['a\n a'], '']);
      assert.deepStrictEqual(inspect(parser, input('    a\n        a', new Context())), [['a\n    a'], '']);
      assert.deepStrictEqual(inspect(parser, input('  a\n a', new Context())), [['a'], ' a']);
      assert.deepStrictEqual(inspect(parser, input(' \ta', new Context())), [['\ta'], '']);
      assert.deepStrictEqual(inspect(parser, input('\ta', new Context())), [['a'], '']);
    });

  });

});
