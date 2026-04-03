import { Input, Output } from '../parser';

export function spend(input: Input, output: Output<unknown>, cost: number): void {
  assert(cost >= 0);
  const resources = input.resources ?? { clock: cost, recursions: [1] };
  if (resources.clock >= 0 && resources.clock - cost < 0) {
    output.error ??= new Error('Too many creations');
  }
  resources.clock -= cost;
}
