import { loop } from '../../../combinator';
import { placeholder } from './placeholder';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/placeholder', () => {
  describe('placeholder', () => {
    const parser = loop(placeholder);

    it('warning', () => {
      assert.deepStrictEqual(inspect(parser('~~~\n~~~')), [["<p><strong>WARNING: DON'T USE <code data-src=\"`~~~`\">~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~\n~~~</pre>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~\n<"\n~~~')), [["<p><strong>WARNING: DON'T USE <code data-src=\"`~~~`\">~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~\n&lt;\"\n~~~</pre>"], ""]);
      assert.deepStrictEqual(inspect(parser('~~~a\n~~~')), [["<p><strong>WARNING: DON'T USE <code data-src=\"`~~~`\">~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~a\n~~~</pre>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~a \n~~~')), [["<p><strong>WARNING: DON'T USE <code data-src=\"`~~~`\">~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~a \n~~~</pre>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~a b \n~~~')), [["<p><strong>WARNING: DON'T USE <code data-src=\"`~~~`\">~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~a b \n~~~</pre>"], '']);
      assert.deepStrictEqual(inspect(parser('~~~ a\n~~~')), [["<p><strong>WARNING: DON'T USE <code data-src=\"`~~~`\">~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~ a\n~~~</pre>"], '']);
    });

  });

});
