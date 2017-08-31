import { parse, escape } from './parser';

describe('Unit: renderer/parser', () => {
  describe('parse', () => {
    it('result', () => {
      assert(parse('') instanceof DocumentFragment);
    });

  });

  describe('escape', () => {
    it('ab', () => {
      assert(escape('*a\\\nb*') === '\\*a\\\\\nb\\*');
    });

    it('autolonk', () => {
      assert(parse(escape('https://a')).firstElementChild!.innerHTML === '<a href="https://a" rel="noopener" target="_blank">https://a</a>');
      assert(parse(escape('!https://host')).firstElementChild!.innerHTML === '<a href="https://host" rel="noopener" target="_blank"><img data-src="https://host" alt=""></a>');
      assert(parse(escape('@a')).firstElementChild!.innerHTML === '<span class="account">@a</span>');
    });

  });

});
