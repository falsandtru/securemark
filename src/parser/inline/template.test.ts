import { template } from './template';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/template', () => {
  describe('template', () => {
    const parser = (source: string) => some(template)(input(source, {}));

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser('')), undefined);
      assert.deepStrictEqual(inspect(parser('{')), undefined);
      assert.deepStrictEqual(inspect(parser('{}')), undefined);
      assert.deepStrictEqual(inspect(parser('{{')), undefined);
      assert.deepStrictEqual(inspect(parser('{{\\}}')), undefined);
      assert.deepStrictEqual(inspect(parser('{{a}b}')), undefined);
      assert.deepStrictEqual(inspect(parser('{{{a}}')), undefined);
      assert.deepStrictEqual(inspect(parser(' {{}}')), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('{{}}')), [['<span class="template">{{}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{}}}')), [['<span class="template">{{}}</span>'], '}']);
      assert.deepStrictEqual(inspect(parser('{{ }}')), [['<span class="template">{{ }}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{ a }}')), [['<span class="template">{{ a }}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{\n}}')), [['<span class="template">{{<br>}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{\\\n}}')), [['<span class="template">{{\\<br>}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{a}}')), [['<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{a b}}')), [['<span class="template">{{a b}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{\\}}}')), [['<span class="template">{{\\}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{<a>}}')), [['<span class="template">{{&lt;a&gt;}}</span>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('{{`a`}}')), [['<span class="template">{{`a`}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{{a}}}')), [['<span class="template">{{{a}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{{{a}}}}')), [['<span class="template">{{{{a}}}}</span>'], '']);
    });

  });

});
