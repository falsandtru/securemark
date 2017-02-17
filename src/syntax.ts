import { loop } from './parser/loop';
import { block } from './syntax/block';

export function parse(source: string): HTMLElement[] {
  return (loop(block)(source) || [[]])[0];
}
