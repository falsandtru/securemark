export class Memo {
  private readonly memory: Record<string, readonly [any[], number] | readonly []>[/* pos */] = [];
  public get length(): number {
    return this.memory.length;
  }
  public offset = 0;
  public get(
    position: number,
    syntax: number,
    state: number,
  ): readonly [any[], number] | readonly [] | undefined {
    //console.log('get', position + this.offset, syntax, state, this.memory[position + this.offset - 1]?.[`${syntax}:${state}`]);;
    return this.memory[position + this.offset - 1]?.[`${syntax}:${state}`];
  }
  public set(
    position: number,
    syntax: number,
    state: number,
    nodes: any[] | undefined,
    offset: number,
  ): void {
    const record = this.memory[position + this.offset - 1] ??= {};
    assert(!record[`${syntax}:${state}`]);
    record[`${syntax}:${state}`] = nodes
      ? [nodes.slice(), offset]
      : [];
    //console.log('set', position + this.offset, syntax, state);
  }
  public clear(position: number): void {
    const memory = this.memory;
    for (let i = position + this.offset, len = memory.length; i < len; ++i) {
      memory.pop();
    }
    //console.log('clear', position);
  }
}
