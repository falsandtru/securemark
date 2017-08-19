import Prism from 'prismjs';

type Prism = typeof Prism;

declare global {
  const Prism: Prism;

  interface HTMLObjectElement {
    typeMustMatch: boolean;
  }
}

import assert from 'power-assert';

type Assert = typeof assert;

declare global {
  const assert: Assert;
}
