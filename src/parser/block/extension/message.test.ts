import { message } from './message';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { inspect } from '../../../debug.test';

describe('Unit: parser/block/extension/message', () => {
  describe('message', () => {
    const parser = (source: string) => some(message)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('~~~message\n~~~'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~~~message/\n~~~'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('~~~message/a\n~~~'), ctx), [['<pre class="invalid" translate="no">~~~message/a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note a\n~~~'), ctx), [['<pre class="invalid" translate="no">~~~message/note a\n~~~</pre>'], '']);
      assert.deepStrictEqual(inspect(parser(`~~~message/note\n0${'\n'.repeat(301)}~~~`), ctx, '>'), [['<pre class="invalid" translate="no">'], '']);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser('~~~message/note\n~~~'), ctx), [['<section class="message" data-type="note"><h1>Note</h1></section>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note\n\n~~~'), ctx), [['<section class="message" data-type="note"><h1>Note</h1></section>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note\na\n~~~'), ctx), [['<section class="message" data-type="note"><h1>Note</h1><p>a</p></section>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note\na\n\n- \n~~~'), ctx), [['<section class="message" data-type="note"><h1>Note</h1><p>a</p><ul><li></li></ul></section>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/note\n# a\n~~~'), ctx), [['<section class="message" data-type="note"><h1>Note</h1><p># a</p></section>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/caution\n~~~'), ctx), [['<section class="message" data-type="caution"><h1>Caution!</h1></section>'], '']);
      assert.deepStrictEqual(inspect(parser('~~~message/warning\n~~~'), ctx), [['<section class="message" data-type="warning"><h1>WARNING!!</h1></section>'], '']);
    });

  });

});
