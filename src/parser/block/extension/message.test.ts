import { message } from './message';
import { some } from '../../../combinator';
import { input } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/message', () => {
  describe('message', () => {
    const parser = some(message);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('~~~message\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~~~message/\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser, input('~~~message/a\n~~~')), [['<pre class="invalid" translate="no">~~~message/a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~message/note a\n~~~')), [['<pre class="invalid" translate="no">~~~message/note a\n~~~</pre>'], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('~~~message/note\n~~~')), [['<section class="message" data-type="note"><h1>Note</h1></section>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~message/note\n\n~~~')), [['<section class="message" data-type="note"><h1>Note</h1></section>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~message/note\na\n~~~')), [['<section class="message" data-type="note"><h1>Note</h1><p>a</p></section>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~message/note\na\n\n- \n~~~')), [['<section class="message" data-type="note"><h1>Note</h1><p>a</p><ul><li></li></ul></section>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~message/note\n# a\n~~~')), [['<section class="message" data-type="note"><h1>Note</h1><p># a</p></section>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~message/caution\n~~~')), [['<section class="message" data-type="caution"><h1>Caution!</h1></section>'], '']);
      assert.deepStrictEqual(inspect(parser, input('~~~message/warning\n~~~')), [['<section class="message" data-type="warning"><h1>WARNING!!</h1></section>'], '']);
    });

  });

});
