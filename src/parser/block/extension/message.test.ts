import { message } from './message';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/message', () => {
  describe('message', () => {
    const parser = (source: string) => some(message)(input(source, {}));

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~message\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~message/\n~~~')), undefined);
      assert.deepStrictEqual(inspect(parser('~~~message/a\n~~~')), [['<pre class="invalid" translate="no">~~~message/a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note a\n~~~')), [['<pre class="invalid" translate="no">~~~message/note a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(`~~~message/note\n0${'\n'.repeat(301)}~~~`), '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~message/note\n~~~')), [['<section class="message" data-type="note"><h1>Note</h1></section>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note\n\n~~~')), [['<section class="message" data-type="note"><h1>Note</h1></section>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note\na\n~~~')), [['<section class="message" data-type="note"><h1>Note</h1><p>a</p></section>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note\na\n\n- \n~~~')), [['<section class="message" data-type="note"><h1>Note</h1><p>a</p><ul><li></li></ul></section>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note\n# a\n~~~')), [['<section class="message" data-type="note"><h1>Note</h1><p># a</p></section>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/caution\n~~~')), [['<section class="message" data-type="caution"><h1>Caution!</h1></section>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/warning\n~~~')), [['<section class="message" data-type="warning"><h1>WARNING!!</h1></section>'], '']);
    });

  });

});
