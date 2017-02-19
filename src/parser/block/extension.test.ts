import { loop } from '../../combinator/loop';
import { extension } from './extension';
import { inspect } from '../debug.test';

describe('Unit: parser/extension', () => {
  describe('extension', () => {
    it('invalid', () => {
      const parser = loop(extension);
      assert.deepStrictEqual(inspect(parser('')), void 0);
      assert.deepStrictEqual(inspect(parser('\n')), void 0);
      assert.deepStrictEqual(inspect(parser('~~~')), void 0);
      assert.deepStrictEqual(inspect(parser('~~~\n')), void 0);
      assert.deepStrictEqual(inspect(parser('~~~\na~~~')), void 0);
      assert.deepStrictEqual(inspect(parser(' ~~~\n~~~')), void 0);
    });

    it('ab', () => {
      const parser = loop(extension);
      assert.deepStrictEqual(inspect(parser('~~~\n\n~~~')), [['<p></p>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~\na\n~~~')), [['<p>a</p>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~\na\nb\n~~~')), [['<p>ab</p>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~\n\\\n~~~')), [['<p>\\</p>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~\n\n\n~~~')), [['<p></p>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~\n~\n~~~')), [['<p>~</p>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~\n~~~~\n~~~')), [['<p>~~~~</p>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~~\n~~~\n~~~~')), [['<p>~~~</p>'], '']);
    });

  });

});
