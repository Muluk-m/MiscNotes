// 1. 实现一个 debounce hook
// 2. 实现 TS Extract 、 Omit 
type MyExtract<T, U> = T extends U ? T : never
type MyExclude<T, U> = T extends U ? never : T

type B = MyExtract<'a' | 'b' | 'c', 'b' | 'c'>
type B1 = MyExclude<'a' | 'b' | 'c', 'b' | 'c'>

type MyPick<P, T extends keyof P> = {
  [K in T]: P[K]
}

type C = MyPick<{ a: 1, b: 2, c: 3 }, 'a' | 'b'>

// keys: a,b,c
// input: a,c
// expect: b


type MyOmit<T, K extends keyof T> = MyPick<T, MyExclude<keyof T, K>>

type D = MyOmit<{ a: 1, b: 2, c: 3 }, 'a'>

