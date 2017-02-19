import { loop } from '../../../combinator/loop';
import { placeholder } from './placeholder';
import { inspect } from '../../debug.test';

describe('Unit: parser/extension/placeholder', () => {
  describe('placeholder', () => {
    it('warning', () => {
      const parser = loop(placeholder);
      assert.deepStrictEqual(inspect(parser('~~~\n~~~')), [["<p><strong>WARNING: DON'T USE <code>~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~\n~~~</pre>"], ""]);
      assert.deepStrictEqual(inspect(parser('~~~\n<"\n~~~')), [["<p><strong>WARNING: DON'T USE <code>~~~</code> SYNTAX!!</strong><br>This <em>extension syntax</em> is reserved for extensibility.</p>", "<pre>~~~\n&lt;\"\n~~~</pre>"], ""]);
    });

  });

});
