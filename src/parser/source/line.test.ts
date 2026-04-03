import { contentline } from './line';
import { input } from '../context';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/line', () => {
  describe('contentline', () => {
    const parser = contentline;

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' ')), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n')), undefined);
      assert.deepStrictEqual(inspect(parser, input(' \n')), undefined);
      assert.deepStrictEqual(inspect(parser, input('\n\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('a')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('a ')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input(' a')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input(' a ')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input(' a\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input(' a \n')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('ab')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('a\nb')), [[], 'b']);
      assert.deepStrictEqual(inspect(parser, input('\\\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('\\ \\\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser, input('\\ \\ \\\n')), [[], '']);
    });

  });

});
