import { loop } from '../../../combinator/loop';
import { placeholder } from './placeholder';
import { inspect } from '../../debug.test';

describe('Unit: parser/extension/placeholder', () => {
  describe('placeholder', () => {
    it('warning', () => {
      const parser = loop(placeholder);
      assert.deepStrictEqual(inspect(parser('```\n```')), [["<p><strong>DON'T USE <code>~~~</code> SYNTAX!!</strong><br>This extension syntax is reserved for extensibility.</p>"], ""]);
    });

  });

});
