import 'mocha';
import _assert from 'power-assert';
import _Prism from 'prismjs';
import 'mathjax';
import 'jquery';

declare global {
  const assert: typeof _assert;

  const Prism: typeof _Prism;

  interface HTMLObjectElement {
    typeMustMatch: boolean;
  }

}
