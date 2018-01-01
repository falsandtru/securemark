import { parse, escape } from './parser';

describe('Unit: renderer/parser', () => {
  describe('parse', () => {
    it('result', () => {
      assert(parse('') instanceof DocumentFragment);
    });

  });

  describe('escape', () => {
    it('ab', () => {
      assert(escape('*a\\\nb*') === '\\*a\\\nb\\*');
    });

    it('autolink', () => {
      assert(parse(escape('https://a')).firstElementChild!.innerHTML === '<a href="https://a" rel="noopener" target="_blank">https://a</a>');
      assert(parse(escape('https://[::]')).firstElementChild!.innerHTML === '<a href="https://[::]" rel="noopener" target="_blank">https://[::]</a>');
      assert(parse(escape('!https://a')).firstElementChild!.innerHTML === '<a href="https://a" rel="noopener" target="_blank"><img data-src="https://a" alt=""></a>');
      assert(parse(escape('@a')).firstElementChild!.innerHTML === '<span class="account">@a</span>');
    });

  });

});
