import { template } from './template';
import { some } from '../../combinator';
import { input } from '../../combinator/data/parser';
import { inspect } from '../../debug.test';

describe('Unit: parser/inline/template', () => {
  describe('template', () => {
    const parser = (source: string) => some(template)(input(source, ctx));
    const { context: ctx } = input('', {});

    it('invalid', () => {
      assert.deepStrictEqual(inspect(parser(''), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('{'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('{}'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('{{'), ctx), undefined);
      assert.deepStrictEqual(inspect(parser('{{\\}}'), ctx), [['<span class="invalid">{{\\}</span>'], '}']);
      assert.deepStrictEqual(inspect(parser('{{a}b}'), ctx), [['<span class="invalid">{{a</span>'], '}b}']);
      assert.deepStrictEqual(inspect(parser('{{{a}}'), ctx), [['<span class="invalid">{{{a}</span>'], '}']);
      assert.deepStrictEqual(inspect(parser(' {{}}'), ctx), undefined);
    });

    it('basic', () => {
      assert.deepStrictEqual(inspect(parser('{{}}'), ctx), [['<span class="template">{{}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{}}}'), ctx), [['<span class="template">{{}}</span>'], '}']);
      assert.deepStrictEqual(inspect(parser('{{ }}'), ctx), [['<span class="template">{{ }}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{ a }}'), ctx), [['<span class="template">{{ a }}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{\n}}'), ctx), [['<span class="template">{{<br>}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{\\\n}}'), ctx), [['<span class="template">{{\\<br>}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{a}}'), ctx), [['<span class="template">{{a}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{a b}}'), ctx), [['<span class="template">{{a b}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{\\}}}'), ctx), [['<span class="template">{{\\}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{<a>}}'), ctx), [['<span class="template">{{&lt;a&gt;}}</span>'], '']);
    });

    it('nest', () => {
      assert.deepStrictEqual(inspect(parser('{{`a`}}'), ctx), [['<span class="template">{{`a`}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{{a}}}'), ctx), [['<span class="template">{{{a}}}</span>'], '']);
      assert.deepStrictEqual(inspect(parser('{{{{a}}}}'), ctx), [['<span class="template">{{{{a}}}}</span>'], '']);
    });

  });

});
