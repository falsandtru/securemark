import { List } from './node';
import { Delimiters } from './delimiter';

export type Parser<N = unknown, C extends Context = Context, D extends Parser<unknown, C>[] = any>
  = (input: Input<C>) => Result<N, C, D>;
export namespace Parser {
  export type Node<P extends Parser> = P extends Parser<infer N> ? N : never;
  export type SubParsers<P extends Parser> = P extends Parser<unknown, any, infer D> ? D : never;
  export type Context<P extends Parser> = P extends Parser<unknown, infer C> ? C : never;
  export type SubNode<P extends Parser> = ExtractSubNode<SubParsers<P>>;
  export type IntermediateParser<P extends Parser> = Parser<SubNode<P>, Context<P>, SubParsers<P>>;
  type ExtractSubNode<D extends Parser[]> = ExtractSubParser<D> extends infer N ? N extends Parser<infer U> ? U : never : never;
  type ExtractSubParser<D extends Parser[]> = D extends (infer P)[] ? P extends Parser ? P : never : never;
}
export type Input<C extends Context = Context> = C;
export type Result<N, C extends Context = Context, D extends Parser<unknown, C>[] = any>
  = List<Node<N>, C, D>
  | undefined;
export { List };
export class Node<N> implements List.Node {
  constructor(
    public value: N,
    public flags: number = 0,
  ) {
  }
  public next?: this = undefined;
  public prev?: this = undefined;
}
export class Context {
  constructor(
    {
      source,
      position,
      segment,
      resources,
      delimiters,
      precedence,
      state,
      linebreak,
      range,
      offset,
      backtracks,
    }: Options = {},
  ) {
    this.source = source ?? '';
    this.position = position ?? 0;
    this.segment = segment ?? 0;
    this.resources = resources;
    this.precedence = precedence ?? 0;
    this.delimiters = delimiters ?? new Delimiters();
    this.state = state ?? 0;
    this.linebreak = linebreak ?? 0;
    this.range = range ?? 0;
    this.offset = offset ?? 0;
    this.backtracks = backtracks ?? {};
  }
  public source: string;
  public position: number;
  public segment: number;
  public readonly resources?: {
    clock: number;
    recursions: number[];
  };
  public precedence: number;
  public delimiters: Delimiters;
  public state: number;
  public linebreak: number;
  public range: number;
  public offset: number;
  // Objectの内部実装を利用する。
  // 探索木を直接使用する場合は探索速度が重要で挿入は相対的に少なく削除は不要かつ不確実であるため
  // AVL木が適当と思われる。
  // メモリの局所性を得るために木ごとに最初の数十から数百byte分のノードをプールしノードが不足した場合は
  // 使い捨てノードを追加またはテーブルに移行するとよいだろう。
  // 最大セグメントサイズ10KB内で探索コストが平均実行性能を圧迫するほど大きくなるとは考えにくいが
  // 探索コストを減らすにはバックトラック位置数が規定数を超えた場合一定区間ごとに探索木を分割する方法が考えられる。
  // 10KBの入力すべてを保持する探索木を1024文字ごとに分割するために必要なテーブルサイズは64bit*98=784byteとなる。
  // 128文字ごとでもテーブルサイズは入力全体の1%未満であるため無視でき16文字ごとでさえ6.25%に過ぎない。
  // 探索木のポインタによるオーバーヘッドを考慮すれば一定サイズ以上ではテーブルのほうが効率的となる。
  // 区間別テーブルは固定サイズであるためプールして再使用できる。
  // 従って分割時のデータ構造は区間ごとに探索木を動的に生成しデータ数に応じてテーブルに移行するのが最も効率的である。
  // これにより最悪時間計算量線形化に要する最悪空間計算量が+1nに局限される。
  // またはテーブルの参照が高速なら変換せず併用してもよい。
  // 木とテーブルいずれにおいてもバックトラックデータとオーバーヘッドを合わせた追加データサイズの最大値は
  // セグメントサイズに制約されるため入力サイズに対する最大追加データサイズの平均比率はかなり小さくなる。
  // 必要なテーブルの最大サイズは最大セグメントサイズであるため最大追加データサイズは入力サイズにかかわらず
  // 10KB*並列数に留まり最大数百文字以下の短文ならば数百byte*並列数となる。
  //
  // 1. データ数が規定数を超えたら区間テーブルを生成しデータを振り分ける。
  //   - 子ノードのポインタだけ保持するとしても1ノード複数データ保持で圧縮できるかは微妙。
  //     - 1ノードに2データ保持すれば2連続データを1/2の確率で捕捉し1バックトラックあたりの平均追加データサイズは
  //       -7byte(((16+1)*2-(16+2))*2+((16+1)*2-(16+2)*2)*2)/4=(32-4)/4=7の10byteに減少する。
  //       2連続データの発生確率が1/5なら-3.2byteの13.8byte、1/10なら+0.4byteの17.4byteに増加する。
  //     - 1ノードに4データ保持すれば2連続データを3/4の確率で捕捉し1バックトラックあたりの平均追加データサイズは
  //       -9byte(((16+1)*2-(16+4))*3+((16+1)*2-(16+4)*2))/4=(42-6)/4=9の8byteに減少する。
  //       2連続データの発生確率が1/5なら-3.6byteの13.4byte、1/10なら+1.2byteの18.2byteに増加する。
  // 2. 区間内のデータ構造は探索木から開始しデータ数が規定数を超えたらテーブルに変換する。
  //   - 1ノード1データ1区間1024文字ならば1024<(64/8*2+1)*61から1区間61データ以上でテーブルのほうが小さくなる。
  //   - 64/8*2+1=17文字に1か所以下のバックトラックでテーブル以上の効率となる。
  //   - 通常の入力でバックトラックが17文字に平均1か所以上となることは考えられず
  //     1段落数百文字あたり平均2、3か所以下が妥当な頻度でありこの場合の最大追加データサイズは
  //     入力内の最大セグメントサイズの10%前後である。
  //
  public backtracks: Record<number, number>;
}
export type Options = Partial<Context>;
export const enum Segment {
  unknown = 0,
  write = 1,
}

export function input<C extends Context>(source: string, context: C): Input<C> {
  context.source = source;
  context.position = 0;
  return context;
}

export function subinput<C extends Context>(source: string, context: C): Input<C> {
  return {
    ...context,
    source,
    position: 0,
    offset: 0,
    backtracks: {},
  };
}

export function failsafe<P extends Parser>(parser: P): P;
export function failsafe<N>(parser: Parser<N>): Parser<N> {
  assert(parser);
  return context => {
    const position = context.position;
    return parser(context) ?? (context.position = position, undefined);
  };
}
