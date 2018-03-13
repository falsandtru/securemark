﻿import { EmphasisParser, inline } from '../inline';
import { combine, some, surround, transform } from '../../combinator';
import { hasText } from './util/verification';
import { strong } from './strong';
import { squash } from '../squash';
import { html } from 'typed-dom';

export const emphasis: EmphasisParser = source =>
  transform(
    surround('*', some(combine<EmphasisParser>([strong, some(inline, '*')])), '*'),
    (ns, rest) => {
      const el = html('em', squash(ns));
      return hasText(el)
        ? [[el], rest]
        : undefined;
    })
    (source);
