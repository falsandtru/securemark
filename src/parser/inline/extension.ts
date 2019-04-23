import { ExtensionParser } from '../inline';
import { union, validate } from '../../combinator';
import { index } from './extension/index';
import { label } from './extension/label';
import { data } from './extension/data';
import { placeholder } from './extension/placeholder';

export const extension: ExtensionParser = validate('[', union([
  index,
  label,
  data,
  placeholder,
]));
