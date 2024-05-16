declare type Undefable<T> = T | undefined
declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}
