function curry<F extends (...params: any) => any>(fun: F): Curry<F> {
    return function curried(...args: any): any {
        if (args.length < fun.length) {
            return curried.bind(null, ...args);
        } else {
            return fun.apply(null, args);
        }
    } as any;
}

type CurryParams<Params extends any[]> = $CurryParams<[], Params>;

type $CurryParams<
    FirstParams extends readonly any[],
    FinalParams extends readonly any[]
> = FinalParams extends readonly [infer First, ...infer Rest]
    ? $CurryParams<[...FirstParams, First], Rest> | FirstParams
    : FirstParams;

type $TupleOfLength<
    Length,
    T,
    Tuple extends any[]
> = Tuple["length"] extends Length
    ? Tuple
    : $TupleOfLength<Length, T, [...Tuple, T]>;

type TupleOfLength<Length, T = unknown> = $TupleOfLength<Length, T, []>;

type Curry<Fun extends (...params: any) => any> = <
    Params extends CurryParams<Parameters<Fun>>
>(
    ...params: Params
) => Params extends Parameters<Fun>
    ? ReturnType<Fun>
    : Curry<
          Parameters<Fun> extends [
              ...TupleOfLength<Params["length"]>,
              ...infer Rest
          ]
              ? (...params: Rest) => ReturnType<Fun>
              : never
      >;

function bob(num: number, str: string, str2: string): boolean {
    return "" + num === str.trim() && str.trim() === str2;
}
const cob = curry(bob);

console.log(cob(9)("9 ", "9"));
console.log(cob(9)("9 ")("9"));
console.log(cob(9,"9 ")("9"));
console.log(cob(9,"9 ","9"));
console.log(cob(9)("9 ")("9 "));
console.log(cob(9, "8 ")("9"));
console.log(cob(8)("9 ")("9"));
console.log(cob(8)("9 ")("9 "));
console.log(cob(8)("8 ")("8 "));
console.log(cob(8)("8 ", "8"));
console.log(cob(8, "8 ", "8"));
console.log(cob()(8, "8 ", "8"));
console.log(cob()()(8, "8 ", "8"));
console.log(cob()(8)()()()("8 ", "8"));
console.log(cob()(8)()("8")()("8"));
console.log(cob()(8, " 8")()()()("8"));
