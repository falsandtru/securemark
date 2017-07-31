import 'mocha';
import _assert from 'power-assert';
import 'mathjax';
import 'jquery';

declare global {
  const assert: typeof _assert;

  interface HTMLObjectElement {
    typeMustMatch: boolean;
  }

}
