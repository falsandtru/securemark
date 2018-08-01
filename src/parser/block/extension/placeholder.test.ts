import { placeholder } from './placeholder';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = some(placeholder);

    it('warning', () => {
      assert.deepStrictEqual(inspect(parser(' ~~~\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~\n~~~')), [["<p><em>Invalid syntax: Extension syntax: ~~~.</em></p>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~\n~~~\n')), [["<p><em>Invalid syntax: Extension syntax: ~~~.</em></p>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~\n<"\n~~~')), [["<p><em>Invalid syntax: Extension syntax: ~~~.</em></p>"], ""]);
      assert.deepStrictEqual(inspect(parser('~~~a\n~~~')), [["<p><em>Invalid syntax: Extension syntax: ~~~.</em></p>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~a \n~~~')), [["<p><em>Invalid syntax: Extension syntax: ~~~.</em></p>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~a b \n~~~')), [["<p><em>Invalid syntax: Extension syntax: ~~~.</em></p>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~ a\n~~~')), [["<p><em>Invalid syntax: Extension syntax: ~~~.</em></p>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~~\n~~~~')), [["<p><em>Invalid syntax: Extension syntax: ~~~.</em></p>"], '']);
    });

  });

});
