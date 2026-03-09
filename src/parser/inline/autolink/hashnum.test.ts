import { autolink } from '../autolink';
import { some } from '../../../combinator';
import { input } from '../../../combinator/data/parser';
import { Context } from '../../context';
import { inspect } from '../../../debug.test';

describe('Unit: parser/inline/autolink/hashnum', () => {
  describe('hashnum', () => {
    const parser = some(autolink);

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser, input('', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('# ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#1#', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#1#2', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#1#2#3', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#1@2', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\\', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\\ ', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#\\\n', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('##', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('##1', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('###1', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{{}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{}}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{#}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#{1}', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(`#${'1'.repeat(10)}`, new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(`#${'1'.repeat(10)}a`, new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input('#　', new Context())), undefined);
      assert.deepStrictEqual(inspect(parser, input(' #1', new Context())), undefined);
    });

    it('valid', () => {
      assert.deepStrictEqual(inspect(parser, input('#1', new Context())), [['<a class="hashnum">#1</a>'], '']);
      assert.deepStrictEqual(inspect(parser, input('#1 ', new Context())), [['<a class="hashnum">#1</a>'], ' ']);
      assert.deepStrictEqual(inspect(parser, input('#1\n', new Context())), [['<a class="hashnum">#1</a>'], '\n']);
      assert.deepStrictEqual(inspect(parser, input('#1\\', new Context())), [['<a class="hashnum">#1</a>'], '\\']);
      assert.deepStrictEqual(inspect(parser, input('#1\\ ', new Context())), [['<a class="hashnum">#1</a>'], '\\ ']);
      assert.deepStrictEqual(inspect(parser, input('#1\\\n', new Context())), [['<a class="hashnum">#1</a>'], '\\\n']);
      assert.deepStrictEqual(inspect(parser, input(`#1'`, new Context())), [[`<a class="hashnum">#1</a>`], `'`]);
      assert.deepStrictEqual(inspect(parser, input(`#1''`, new Context())), [[`<a class="hashnum">#1</a>`], `''`]);
      assert.deepStrictEqual(inspect(parser, input('#123456789', new Context())), [['<a class="hashnum">#123456789</a>'], '']);
    });

  });

});
