import { List } from './data';
import { Delimiters } from './parser/context/delimiter';

export type Parser<N, C extends Ctx = Ctx, D extends Parser<unknown, C>[] = any>
  = (input: Input<C>) => Result<N, C, D>;
export interface Input<C extends Ctx = Ctx> {
  readonly context: C;
}
export type Result<N, C extends Ctx = Ctx, D extends Parser<unknown, C>[] = any>
  = List<Data<N>, C, D>
  | undefined;
export { List };
export class Data<N> implements List.Node {
  constructor(public value: N) {
  }
  public next?: this = undefined;
  public prev?: this = undefined;
}
export interface Ctx extends CtxOptions {
  source: string;
  position: number;
}
export interface CtxOptions {
  readonly resources?: {
    clock: number;
    recursions: number[];
  };
  offset?: number;
  precedence?: number;
  delimiters?: Delimiters;
  state?: number;
  // Objectの内部実装を利用する。
  // 探索木を直接使用する場合は探索速度が重要で挿入は相対的に少なく削除は不要かつ不確実であるため
  // AVL木が適当と思われる。
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
  backtracks?: Record<number, number>;
  linebreak?: number;
  range?: number;
}
export type Node<P extends Parser<unknown>> = P extends Parser<infer N> ? N : never;
export type SubParsers<P extends Parser<unknown>> = P extends Parser<unknown, Ctx, infer D> ? D : never;
export type Context<P extends Parser<unknown>> = P extends Parser<unknown, infer C> ? C : never;
export type SubNode<P extends Parser<unknown>> = ExtractSubNode<SubParsers<P>>;
export type IntermediateParser<P extends Parser<unknown>> = Parser<SubNode<P>, Context<P>, SubParsers<P>>;
type ExtractSubNode<D extends Parser<unknown>[]> = ExtractSubParser<D> extends infer N ? N extends Parser<infer U> ? U : never : never;
type ExtractSubParser<D extends Parser<unknown>[]> = D extends (infer P)[] ? P extends Parser<unknown> ? P : never : never;

export function input<C extends CtxOptions>(source: string, context: C): Input<C & Ctx> {
  // @ts-expect-error
  context.source = source;
  // @ts-expect-error
  context.position = 0;
  return {
    // @ts-expect-error
    context,
  };
}

export function subinput<C extends Ctx>(source: string, context: C): Input<C> {
  return {
    context: {
      ...context,
      source,
      position: 0,
      offset: undefined,
      backtracks: {},
    }
  };
}

export function failsafe<P extends Parser<unknown>>(parser: P): P;
export function failsafe<N>(parser: Parser<N>): Parser<N> {
  assert(parser);
  return input => {
    const position = input.context.position;
    return parser(input) ?? (input.context.position = position, undefined);
  };
}
