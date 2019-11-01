import { template } from './template';
import { some } from '../../combinator';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/template', () => {
  describe('template', () => {
    const parser = (source: string) => some(template)(source, {}, {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('{{')), undefined);
      assert.deepStrictEqual(inspect(parser('{{\n}}')), undefined);
      assert.deepStrictEqual(inspect(parser('a{{b}}')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('{{}}')), [['<span class="template">{{}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{a}}')), [['<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{a b}}')), [['<span class="template">{{a b}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{ a }}')), [['<span class="template">{{ a }}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{\\}}}')), [['<span class="template">{{\\}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{{}}}')), [['<span class="template">{{{}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('!{{}}')), [['!', '<span class="template">{{}}</span>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('{{`a`}}')), [['<span class="template">{{`a`}}</span>'], '']);
    });

  });

});
