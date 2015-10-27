export function autobind(target, key, { value: fn }) {
  return {
    configurable: true,
    enumerable: false,

    get() {
      const bound = fn.bind(this)

      Object.defineProperty(this, key, {
        value: bound,
        writable: true,
        configurable: true,
        enumerable: false
      })

      return bound
    }
  }
}
