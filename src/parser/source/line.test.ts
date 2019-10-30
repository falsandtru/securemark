import { blankline, contentline } from './line';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/line', () => {
  describe('blankline', () => {
    const parser = (source: string) => blankline(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('ab')), undefined);
      assert.deepStrictEqual(inspect(parser('ab\n')), undefined);
      assert.deepStrictEqual(inspect(parser('ab \n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\n ')), [[], ' ']);
      assert.deepStrictEqual(inspect(parser('\n\n')), [[], '\n']);
      assert.deepStrictEqual(inspect(parser(' ')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' \n\n')), [[], '\n']);
      assert.deepStrictEqual(inspect(parser('\\\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\\ \\\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('\\ \\ \\\n')), [[], '']);
    });

  });

  describe('contentline', () => {
    const parser = (source: string) => contentline(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser(' ')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser(' \n')), undefined);
      assert.deepStrictEqual(inspect(parser('\n\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('a')), [[], '']);
      assert.deepStrictEqual(inspect(parser('a ')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a ')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a\n')), [[], '']);
      assert.deepStrictEqual(inspect(parser(' a \n')), [[], '']);
      assert.deepStrictEqual(inspect(parser('ab')), [[], '']);
      assert.deepStrictEqual(inspect(parser('a\nb')), [[], 'b']);
    });

  });

});
