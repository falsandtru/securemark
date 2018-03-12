import { line, contentline, emptyline } from './line';
import { inspect } from '../../debug.test';

describe('Unit: parser/source/line', () => {
  describe('line', () => {
    it('invalid', () => {
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'])(' \n')), undefined);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])('\n\n')), undefined);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'])('\n\n\n')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(line(_ => [[], ''])('\n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''])(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'])('\n\n')), [[], '\n']);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n\n'])('\n\n\n')), [[], '\n\n']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''], false)(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(line(_ => [[], '\n'], false)(' \n')), [[], '\n']);
      assert.deepStrictEqual(inspect(line(_ => [[], ''], false, true)(' \n')), [[], '']);
      assert.deepStrictEqual(inspect(line(s => [[s[0]], s.slice(1)], false, true)(' \n')), [[' '], '\n']);
      assert.deepStrictEqual(inspect(line(s => [[s], ''], true, true)(' \n\n')), [[' \n'], '\n']);
    });

  });

  describe('emptyline', () => {
    const parser = emptyline;

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
    const parser = contentline;

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
