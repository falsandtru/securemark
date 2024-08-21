import { max } from 'spica/alias';

export class Memo {
  constructor(
    public readonly targets = ~0,
    public readonly margin = 0,
  ) {
  }
  private memory: Record<number, Record<number, Record<number, readonly [any[], number] | readonly []>> | undefined> = {};
  private count = 0;
  private $length = 0;
  public get length(): number {
    return this.$length;
  }
  public get(
    position: number,
    syntax: number,
    state: number,
  ): readonly [any[], number] | readonly [] | undefined {
    assert(position > 0);
    if (this.count === 0) return;
    //console.log('get', position, syntax, state, this.memory[position - 1]?.[syntax]?.[state]);
    const cache = this.memory[position - 1]?.[syntax]?.[state];
    return cache?.length === 2
      ? [cache[0].slice(), cache[1]]
      : cache;
  }
  public set(
    position: number,
    syntax: number,
    state: number,
    nodes: any[] | undefined,
    offset: number,
  ): void {
    assert(position > 0);
    this.$length = max(this.$length, position);
    const record = this.memory[position - 1] ??= (++this.count, {});
    assert(!record[syntax]?.[state]);
    (record[syntax] ??= {})[state] = nodes
      ? [nodes.slice(), offset]
      : [];
    //console.log('set', position, syntax, state, record[syntax]?.[state]);
  }
  public resize(position: number): void {
    const memory = this.memory;
    for (let i = this.$length; i > position; this.$length = --i) {
      if (!(i in memory)) continue;
      memory[i] &&= (--this.count, undefined);
    }
    //console.log('resize', position + 1);
  }
  public clear(): void {
    this.memory = {};
    this.count = 0;
    this.$length = 0;
  }
}
