import { contentline } from './line';
import { input } from '../../combinator/data/parser';
import { Context } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/line', () => {
  describe('contentline', () => {
    const parser = contentline;

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' \n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n\n', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('a', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('a ', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input(' a', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input(' a ', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input(' a\n', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input(' a \n', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('ab', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('a\nb', new Context())), [[], 'b']);
      assert.deepStrictEqual(inspect(parser, input('\\\n', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('\\ \\\n', new Context())), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('\\ \\ \\\n', new Context())), [[], '']);
    });

  });

});
