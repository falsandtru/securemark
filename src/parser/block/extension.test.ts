import { extension } from './extension';
import { loop } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/block/extension', () => {
  describe('extension', () => {
    const parser = loop(extension);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('\n')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~\n')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~\na~~~')), undefined);
      assert.deepStrictEqual(inspect(parser(' ~~~\n~~~')), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~\n~~~')), [["<p><strong>WARNING: DON'T USE <code data-src=\"`~~~`\">~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~\n~~~</pre>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~a\n~~~')), [["<p><strong>WARNING: DON'T USE <code data-src=\"`~~~`\">~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~a\n~~~</pre>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~a \n~~~')), [["<p><strong>WARNING: DON'T USE <code data-src=\"`~~~`\">~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~a \n~~~</pre>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~a b \n~~~')), [["<p><strong>WARNING: DON'T USE <code data-src=\"`~~~`\">~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~a b \n~~~</pre>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~ a\n~~~')), [["<p><strong>WARNING: DON'T USE <code data-src=\"`~~~`\">~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~ a\n~~~</pre>"], '']);
    });

  });

});
