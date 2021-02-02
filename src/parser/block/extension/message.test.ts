import { message } from './message';
import { some } from '../../../combinator';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/message', () => {
  describe('message', () => {
    const parser = (source: string) => some(message)(source, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~message\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~message/\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~message/a\n~~~')), [['<pre class="notranslate invalid">~~~message/a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note a\n~~~')), [['<pre class="notranslate invalid">~~~message/note a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(`~~~message/note\n0${'\n'.repeat(301)}~~~`), '>'), [['<pre class="notranslate invalid">'], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~message/note\n~~~')), [['<div class="message type-note"><h6>Note</h6></div>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note\n\n~~~')), [['<div class="message type-note"><h6>Note</h6></div>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note\na\n~~~')), [['<div class="message type-note"><h6>Note</h6><p>a</p></div>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note\na\n\n- \n~~~')), [['<div class="message type-note"><h6>Note</h6><p>a</p><ul><li></li></ul></div>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note\n# a\n~~~')), [['<div class="message type-note"><h6>Note</h6><p># a</p></div>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/caution\n~~~')), [['<div class="message type-caution"><h6>Caution!</h6></div>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/warning\n~~~')), [['<div class="message type-warning"><h6>WARNING!!</h6></div>'], '']);
    });

  });

});
