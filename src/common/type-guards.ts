import { AnyObject } from './utils/object'


export const isArray = <V>(val: any): val is Array<V> => {
  return Array.isArray(val)
}

export function isFunction<F extends ((...args: any[]) => any) = ((...args: any[]) => any)>(
  val: any
): val is F {
  return typeof val === 'function'
}

export const isObject = <T extends AnyObject>(val: any): val is T => {
  return !isArray(val) && typeof val === 'object'
}

export const isMap = <K extends keyof any = keyof any, V extends any = any>(val: any): val is Map<K, V> => {
  return val instanceof Map
}

export const isNumber = (val: any): val is number => {
  return typeof val === 'number' && !isNaN(val) && isFinite(val)
}
