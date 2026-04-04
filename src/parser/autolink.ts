import { DocumentParser } from '../../markdown';
import { union, some, lazy } from '../combinator';
import { autolink as autolink_ } from './inline/autolink';
import { unescsource } from './source';

export import AutolinkParser = DocumentParser.AutolinkParser;

export const autolink: AutolinkParser = lazy(() =>
  some(union([
    autolink_,
    unescsource,
  ])));
